'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Summer Collection 2026',
    subtitle: 'Up to 50% off',
    description: 'Fresh styles for the sunny season',
    image: 'https://picsum.photos/seed/hero1/1200/500',
    link: '/shop?category=womens-clothing',
    color: 'from-pink-500/90 to-rose-600/90',
  },
  {
    title: 'Men\'s Native Wear',
    subtitle: 'Premium Senator Styles',
    description: 'Look sharp at every occasion',
    image: 'https://picsum.photos/seed/hero2/1200/500',
    link: '/shop?category=mens-clothing',
    color: 'from-blue-900/90 to-indigo-900/90',
  },
  {
    title: 'Flash Sale 🔥',
    subtitle: 'Limited time deals',
    description: 'Grab them before they\'re gone',
    image: 'https://picsum.photos/seed/hero3/1200/500',
    link: '/shop?featured=flash-sale',
    color: 'from-orange-500/90 to-red-500/90',
  },
];

export default function HeroBanner() {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[300px] sm:h-[400px] md:h-[450px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.link}>
              <div className="relative h-full w-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
                <div className="absolute inset-0 flex items-center">
                  <div className="container-main">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1 rounded-full mb-3">
                      {slide.subtitle}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 max-w-md">
                      {slide.title}
                    </h2>
                    <p className="text-white/80 text-lg mb-6">{slide.description}</p>
                    <span className="btn-primary inline-block bg-white text-[#FF3F6C] hover:bg-white/90">
                      Shop Now
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
