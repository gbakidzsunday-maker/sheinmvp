import Link from 'next/link';
import { formatNaira, calculateDiscountPrice } from '@/lib/utils';
import type { ProductListItem } from '@/types';

export default function ProductCard({ product }: { product: ProductListItem }) {
  const finalPrice = calculateDiscountPrice(product.price, product.discount);

  return (
    <Link href={`/product/${product.slug}`} className="card group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <img
          src={product.images[0]?.url || '/placeholder.png'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        {product.isFlashSale && product.discount > 20 && (
          <span className="flash-badge">⚡ -{product.discount}%</span>
        )}
        {product.discount > 0 && !product.isFlashSale && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        {product.isNewArrival && !product.discount && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            NEW
          </span>
        )}

        {/* Hover: show second image */}
        {product.images[1] && (
          <img
            src={product.images[1].url}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
          />
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-sm font-medium line-clamp-2 leading-snug mb-1">
          {product.title}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400 text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm sm:text-base">{formatNaira(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-xs text-gray-400 line-through">{formatNaira(product.price)}</span>
          )}
        </div>

        {/* Available colors */}
        {product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.color}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: c.hex }}
                title={c.color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
