import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature
    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 });
    }

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Only process successful charge events
    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;

      const order = await prisma.order.findFirst({
        where: { paystackReference: reference },
        include: { items: true },
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (order.status === 'paid') {
        return NextResponse.json({ success: true, message: 'Already processed' });
      }

      // Update order and reduce stock in transaction
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'paid',
            paidAt: new Date(),
            paystackStatus: 'success',
          },
        }),
        // Reduce stock for each order item
        ...order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
      ]);

      console.log(`✅ Order ${order.orderNumber} marked as paid via webhook`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
