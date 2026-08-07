'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineSearch, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi';
import { HiOutlineMenu, HiX } from 'react-icons/hi';
import { useCartStore } from '@/lib/store';

export default function Header() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      {/* Top bar */}
      <div className="hidden md:block bg-black text-white text-xs text-center py-2 px-4">
        🚀 Free delivery on orders over ₦50,000 | New arrivals daily!
      </div>

      {/* Main header */}
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tight">
            <span className="text-[#FF3F6C]">ZARA</span>
            <span className="text-black">FASHION</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium hover:text-[#FF3F6C] transition-colors">
              Shop
            </Link>
            <Link href="/shop?category=womens-clothing" className="text-sm font-medium hover:text-[#FF3F6C] transition-colors">
              Women
            </Link>
            <Link href="/shop?category=mens-clothing" className="text-sm font-medium hover:text-[#FF3F6C] transition-colors">
              Men
            </Link>
            <Link href="/shop?category=shoes" className="text-sm font-medium hover:text-[#FF3F6C] transition-colors">
              Shoes
            </Link>
            <Link href="/shop?category=bags" className="text-sm font-medium hover:text-[#FF3F6C] transition-colors">
              Bags
            </Link>
            <Link href="/shop?category=beauty" className="text-sm font-medium hover:text-[#FF3F6C] transition-colors">
              Beauty
            </Link>
          </nav>

          {/* Search + Icons */}
          <div className="flex items-center gap-3">
            {/* Search bar — hidden on mobile */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fashion..."
                  className="w-56 pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:bg-white
                             transition-all duration-200"
                />
              </div>
            </form>

            <Link href="/wishlist" className="p-2 hover:text-[#FF3F6C] transition-colors" aria-label="Wishlist">
              <HiOutlineHeart size={22} />
            </Link>

            <Link href="/cart" className="p-2 hover:text-[#FF3F6C] transition-colors relative" aria-label="Cart">
              <HiOutlineShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF3F6C] text-white text-[10px] font-bold
                                 w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <Link href="/account" className="p-2 hover:text-[#FF3F6C] transition-colors" aria-label="Account">
              <HiOutlineUser size={22} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search — visible on mobile only */}
      <div className="md:hidden container-main pb-3">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fashion..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:bg-white"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top">
          <nav className="container-main py-4 space-y-3">
            {[
              { label: 'Shop All', href: '/shop' },
              { label: "Women's Clothing", href: '/shop?category=womens-clothing' },
              { label: "Men's Clothing", href: '/shop?category=mens-clothing' },
              { label: 'Shoes', href: '/shop?category=shoes' },
              { label: 'Bags', href: '/shop?category=bags' },
              { label: 'Accessories', href: '/shop?category=accessories' },
              { label: 'Beauty', href: '/shop?category=beauty' },
              { label: 'Flash Sale 🔥', href: '/shop?featured=flash-sale' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium py-1 hover:text-[#FF3F6C] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
