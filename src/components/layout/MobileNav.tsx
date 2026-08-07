'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineSearch, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi';
import { HiHome, HiHeart, HiShoppingBag, HiUser } from 'react-icons/hi';
import { useCartStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Home', icon: HiOutlineHome, activeIcon: HiHome },
  { href: '/shop', label: 'Shop', icon: HiOutlineSearch, activeIcon: HiOutlineSearch },
  { href: '/wishlist', label: 'Wishlist', icon: HiOutlineHeart, activeIcon: HiHeart },
  { href: '/cart', label: 'Cart', icon: HiOutlineShoppingBag, activeIcon: HiShoppingBag },
  { href: '/account', label: 'Account', icon: HiOutlineUser, activeIcon: HiUser },
];

export default function MobileNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="relative">
              <Icon size={22} />
              {item.label === 'Cart' && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#FF3F6C] text-white text-[9px] font-bold
                                 w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
