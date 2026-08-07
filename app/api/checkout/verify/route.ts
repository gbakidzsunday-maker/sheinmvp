import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPayment } from '@/lib/paystack';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Reference required' }, { status: 400 });
    }

    const verification = await verifyPayment(reference);

    if (!verification.status) {
      return NextResponse.json({ success: false, message: verification.message });
    }

    const txData = verification.data;

    // Find order by Paystack reference
    const order = await prisma.order.findFirst({
      where: { paystackReference: reference },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order based on Paystack status
    if (txData.status === 'success') {
      // Update order status and reduce stock
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'paid',
            paidAt: new Date(),
            paystackStatus: 'success',
          },
        }),
        // Reduce stock for each item
        ...order.items
          ? [] // We'll do stock reduction in webhook
          : [],
      ]);

      // Reduce product stock
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: order.id },
      });

      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return NextResponse.json({
      success: txData.status === 'success',
      status: txData.status,
      reference,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
