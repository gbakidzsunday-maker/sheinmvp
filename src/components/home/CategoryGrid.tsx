import Link from 'next/link';

const categories = [
  { name: "Women's Clothing", slug: 'womens-clothing', icon: '👗', image: 'https://picsum.photos/seed/cat-women/400/400' },
  { name: "Men's Clothing", slug: 'mens-clothing', icon: '👔', image: 'https://picsum.photos/seed/cat-men/400/400' },
  { name: 'Shoes', slug: 'shoes', icon: '👠', image: 'https://picsum.photos/seed/cat-shoes/400/400' },
  { name: 'Bags', slug: 'bags', icon: '👜', image: 'https://picsum.photos/seed/cat-bags/400/400' },
  { name: 'Accessories', slug: 'accessories', icon: '💍', image: 'https://picsum.photos/seed/cat-acc/400/400' },
  { name: 'Beauty', slug: 'beauty', icon: '💄', image: 'https://picsum.photos/seed/cat-beauty/400/400' },
];

export default function CategoryGrid() {
  return (
    <section className="py-8">
      <div className="container-main">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black">Shop by Category</h2>
          <p className="text-sm text-gray-500 mt-1">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="card group text-center p-4 hover:border-[#FF3F6C] transition-all"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl mb-3 overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="relative z-10 drop-shadow-lg text-2xl">{cat.icon}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold group-hover:text-[#FF3F6C] transition-colors leading-tight">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
