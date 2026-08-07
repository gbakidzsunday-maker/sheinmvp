'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProducts } from '@/lib/api';
import { formatNaira, calculateDiscountPrice } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/product/ProductSkeleton';
import ShopFilters from '@/components/product/ShopFilters';
import type { ProductListItem } from '@/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const rating = searchParams.get('rating') || '';

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { sort, page, limit: 24 };
      if (category) params.category = category;
      if (search) params.search = search;
      if (featured) params.featured = featured;
      if (minPrice) params.minPrice = parseInt(minPrice) * 100; // convert naira to kobo
      if (maxPrice) params.maxPrice = parseInt(maxPrice) * 100;
      if (size) params.size = size;
      if (color) params.color = color;
      if (rating) params.rating = parseInt(rating);

      const data = await fetchProducts(params);
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [category, sort, page, search, featured, minPrice, maxPrice, size, color, rating]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page'); // reset page on filter change
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/shop');
  };

  const hasFilters = category || search || featured || minPrice || maxPrice || size || color || rating;

  return (
    <div className="container-main py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-[#FF3F6C]">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">
          {featured === 'flash-sale' ? '⚡ Flash Sale' :
           featured === 'best-seller' ? '🏆 Best Sellers' :
           featured === 'new-arrival' ? '✨ New Arrivals' :
           category ? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') :
           search ? `Search: "${search}"` : 'All Products'}
        </span>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <ShopFilters
            searchParams={Object.fromEntries(searchParams.entries())}
            onFilterChange={updateFilter}
            onClear={clearFilters}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-sm text-gray-500">
              {total} product{total !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C]"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="best-selling">Best Selling</option>
                <option value="rating">Top Rated</option>
              </select>
              {/* Mobile filter toggle */}
              <button
                className="lg:hidden text-sm border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1"
                onClick={() => {
                  // Toggle mobile filter panel — simplified for now
                  updateFilter('mobileFilter', 'open');
                }}
              >
                <span>Filters</span>
                {hasFilters && <span className="bg-[#FF3F6C] text-white w-2 h-2 rounded-full" />}
              </button>
            </div>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => updateFilter('page', String(currentPage - 1))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 hover:border-[#FF3F6C]"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateFilter('page', String(p))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage
                      ? 'bg-[#FF3F6C] text-white'
                      : 'border border-gray-200 hover:border-[#FF3F6C]'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => updateFilter('page', String(currentPage + 1))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 hover:border-[#FF3F6C]"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-main py-6"><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({length:12}).map((_,i)=><div key={i} className="skeleton aspect-[3/4] rounded-2xl" />)}</div></div>}>
      <ShopContent />
    </Suspense>
  );
}
