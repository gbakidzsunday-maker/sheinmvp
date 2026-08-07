'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { HiOutlineHeart, HiHeart, HiMinus, HiPlus } from 'react-icons/hi';
import { formatNaira, calculateDiscountPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store';
import ProductCard from '@/components/product/ProductCard';
import type { ProductDetail, ProductListItem } from '@/types';

export default function ProductDetailClient({
  product,
  related,
}: {
  product: ProductDetail;
  related: ProductListItem[];
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  const finalPrice = calculateDiscountPrice(product.price, product.discount);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      image: product.images[0]?.url || '',
      price: product.price,
      discount: product.discount,
      quantity,
      size: selectedSize,
      color: selectedColor,
      maxStock: product.stock,
    });
    toast.success('Added to cart!', { icon: '🛒' });
  };

  const handleWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (data.added) {
        setWishlisted(true);
        toast.success('Added to wishlist!');
      } else {
        setWishlisted(false);
        toast.success('Removed from wishlist');
      }
    } catch {
      toast.error('Please sign in to use wishlist');
    }
  };

  return (
    <div className="container-main py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#FF3F6C]">Home</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#FF3F6C]">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-black font-medium truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Product detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-3">
            <img
              src={product.images[selectedImage]?.url || '/placeholder.png'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="discount-badge text-base px-3 py-1.5">-{product.discount}%</span>
            )}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center
                         hover:bg-white transition-colors shadow-md"
              aria-label="Wishlist"
            >
              {wishlisted ? (
                <HiHeart size={22} className="text-[#FF3F6C]" />
              ) : (
                <HiOutlineHeart size={22} />
              )}
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-[#FF3F6C]' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black">{formatNaira(finalPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatNaira(product.price)}</span>
                  <span className="badge-red">Save {product.discount}%</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3">
                Color: {selectedColor ? <span className="text-[#FF3F6C]">{selectedColor}</span> : 'Select'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setSelectedColor(selectedColor === c.color ? null : c.color)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                      selectedColor === c.color
                        ? 'border-[#FF3F6C] bg-[#FFF1F4] text-[#FF3F6C] font-semibold'
                        : 'border-gray-200 hover:border-[#FF3F6C]'
                    }`}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3">
                Size: {selectedSize ? <span className="text-[#FF3F6C]">{selectedSize}</span> : 'Select'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(selectedSize === s.size ? null : s.size)}
                    disabled={s.stock === 0}
                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                      s.stock === 0
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                        : selectedSize === s.size
                        ? 'border-[#FF3F6C] bg-[#FFF1F4] text-[#FF3F6C] font-semibold'
                        : 'border-gray-200 hover:border-[#FF3F6C]'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-0 border border-gray-200 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-l-lg"
              >
                <HiMinus size={16} />
              </button>
              <span className="w-12 text-center font-semibold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-r-lg"
              >
                <HiPlus size={16} />
              </button>
            </div>
            {product.stock < 10 && (
              <p className="text-xs text-orange-500 mt-2">
                Only {product.stock} left in stock — hurry!
              </p>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary w-full text-center text-lg py-4 mb-3"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
          </button>

          {/* Delivery info */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span>🚚</span>
              <span>Free delivery on orders over ₦50,000</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>Easy 7-day returns</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💳</span>
              <span>Secure payment via Paystack</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-black mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
