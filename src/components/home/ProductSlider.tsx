'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { formatNaira, calculateDiscountPrice } from '@/lib/utils';
import type { ProductListItem } from '@/types';

interface ProductSliderProps {
  title: string;
  subtitle: string;
  products: ProductListItem[];
  link: string;
}

export default function ProductSlider({ title, subtitle, products, link }: ProductSliderProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container-main">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <Link href={link} className="text-sm font-semibold text-[#FF3F6C] hover:underline hidden sm:block">
            View All →
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="!pb-2"
        >
          {products.map((product) => {
            const finalPrice = calculateDiscountPrice(product.price, product.discount);
            return (
              <SwiperSlide key={product.id}>
                <Link href={`/product/${product.slug}`} className="card group block">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={product.images[0]?.url || '/placeholder.png'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {product.discount > 0 && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-2 leading-snug mb-1">{product.title}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-xs text-gray-500">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{formatNaira(finalPrice)}</span>
                      {product.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">{formatNaira(product.price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <Link href={link} className="w-full mt-4 btn-primary text-center block sm:hidden">
          View All
        </Link>
      </div>
    </section>
  );
}
