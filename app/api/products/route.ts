import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const minRating = searchParams.get('rating');
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const featured = searchParams.get('featured'); // flash-sale, best-seller, new-arrival
    const search = searchParams.get('search');

    const where: any = { isActive: true };

    if (category) where.category = { slug: category };
    if (minPrice) where.price = { ...where.price, gte: parseInt(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseInt(maxPrice) };
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (search) where.title = { contains: search, mode: 'insensitive' };

    if (featured === 'flash-sale') where.isFlashSale = true;
    if (featured === 'best-seller') where.isBestSeller = true;
    if (featured === 'new-arrival') where.isNewArrival = true;

    // Size filter needs to join
    if (size) {
      where.sizes = { some: { size } };
    }
    if (color) {
      where.colors = { some: { color } };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'best-selling':
        orderBy = { reviewCount: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { select: { url: true, alt: true }, orderBy: { sortOrder: 'asc' }, take: 3 },
          sizes: { select: { size: true, stock: true } },
          colors: { select: { color: true, hex: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
