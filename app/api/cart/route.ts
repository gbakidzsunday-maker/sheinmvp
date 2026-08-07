import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get cart for logged-in users (sync from DB)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ items: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: (session.user as any).id },
      include: {
        product: {
          include: {
            images: { take: 1, orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    });

    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      title: item.product.title,
      image: item.product.images[0]?.url || '',
      price: item.product.price,
      discount: item.product.discount,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      maxStock: item.product.stock,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// Sync local cart to DB (called on login)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();
    const userId = (session.user as any).id;

    // Clear existing cart
    await prisma.cartItem.deleteMany({ where: { userId } });

    // Add new items
    if (items && items.length > 0) {
      for (const item of items) {
        await prisma.cartItem.upsert({
          where: {
            userId_productId_size_color: {
              userId,
              productId: item.productId,
              size: item.size || '',
              color: item.color || '',
            },
          },
          update: { quantity: item.quantity },
          create: {
            userId,
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
}

// Add item
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const { productId, quantity, size, color } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    if (session?.user) {
      const userId = (session.user as any).id;
      await prisma.cartItem.upsert({
        where: {
          userId_productId_size_color: {
            userId,
            productId,
            size: size || '',
            color: color || '',
          },
        },
        update: { quantity: { increment: quantity || 1 } },
        create: {
          userId,
          productId,
          quantity: quantity || 1,
          size: size || null,
          color: color || null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// Remove item
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    if (session?.user) {
      await prisma.cartItem.deleteMany({
        where: { id: itemId, userId: (session.user as any).id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart remove error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
