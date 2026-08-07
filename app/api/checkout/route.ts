import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { initializePayment, generateReference } from '@/lib/paystack';
import { generateOrderNumber, DELIVERY_FEE } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, city, state, items } = body;

    // Validate
    if (!name || !email || !phone || !address || !city || !state) {
      return NextResponse.json(
        { error: 'All shipping fields are required' },
        { status: 400 }
      );
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate totals (all in kobo)
    let subtotal = 0;
    const orderItems: { productId: string; quantity: number; price: number; size: string | null; color: string | null }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${item.title || 'Product'} is out of stock or has insufficient quantity` },
          { status: 400 }
        );
      }

      const discountPrice = Math.round(product.price * (1 - product.discount / 100));
      subtotal += discountPrice * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: discountPrice,
        size: item.size || null,
        color: item.color || null,
      });
    }

    const total = subtotal + DELIVERY_FEE;
    const reference = generateReference();
    const orderNumber = generateOrderNumber();

    // Get user ID if logged in
    const session = await auth();
    const userId = session?.user ? (session.user as any).id : null;

    // Create order in pending state
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'pending',
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        name,
        email,
        phone,
        address,
        city,
        state,
        paystackReference: reference,
        paystackStatus: 'pending',
        userId,
        items: {
          create: orderItems,
        },
      },
    });

    // Initialize Paystack payment (amount must be in kobo)
    const payment = await initializePayment({
      email,
      amount: total,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?ref=${reference}`,
      metadata: {
        orderId: order.id,
        orderNumber,
      },
    });

    if (!payment.status) {
      // Delete the pending order if payment init fails
      await prisma.order.delete({ where: { id: order.id } });
      return NextResponse.json(
        { error: payment.message || 'Payment initialization failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: payment.data.authorization_url,
      reference,
      orderNumber,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed. Please try again.' },
      { status: 500 }
    );
  }
}
