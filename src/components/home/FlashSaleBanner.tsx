import Link from 'next/link';
import { formatNaira, calculateDiscountPrice } from '@/lib/utils';
import type { ProductListItem } from '@/types';

export default function FlashSaleBanner({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container-main">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 md:p-8 border border-orange-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-2">
                ⚡ Flash Sale
                <span className="text-sm font-normal bg-orange-500 text-white px-3 py-1 rounded-full">
                  Limited time
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">Hurry! Deals end soon</p>
            </div>
            <Link href="/shop?featured=flash-sale" className="btn-outline text-sm px-4 py-2 hidden sm:inline-flex">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.slice(0, 6).map((product) => {
              const finalPrice = calculateDiscountPrice(product.price, product.discount);
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={product.images[0]?.url || '/placeholder.png'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {product.discount > 0 && (
                      <span className="flash-badge">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 truncate">{product.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold">{formatNaira(finalPrice)}</span>
                      {product.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">{formatNaira(product.price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <Link href="/shop?featured=flash-sale" className="btn-primary mt-6 w-full text-center sm:hidden block">
            View All Flash Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
