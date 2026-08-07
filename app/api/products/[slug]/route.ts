import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { url: true, alt: true }, orderBy: { sortOrder: 'asc' } },
        sizes: { select: { size: true, stock: true } },
        colors: { select: { color: true, hex: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch related products (same category, excluding current)
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 8,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { url: true, alt: true }, orderBy: { sortOrder: 'asc' }, take: 2 },
        sizes: { select: { size: true, stock: true } },
        colors: { select: { color: true, hex: true } },
      },
    });

    return NextResponse.json({ product, related });
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
