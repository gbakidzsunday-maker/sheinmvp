'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { fetchWishlist, removeFromWishlist } from '@/lib/api';
import { formatNaira, calculateDiscountPrice } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist()
        .then((data) => setItems(data.items || []))
        .catch(() => toast.error('Failed to load wishlist'))
        .finally(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="container-main py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#FF3F6C] border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-6xl mb-4">❤️</p>
        <h1 className="text-2xl font-bold mb-2">Sign in to view your wishlist</h1>
        <p className="text-gray-500 mb-6">Save your favorite items and come back to them anytime.</p>
        <Link href="/account" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-6xl mb-4">💔</p>
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-6">Start saving items you love!</p>
        <Link href="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-main py-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <ProductCard key={item.id} product={item.product} />
        ))}
      </div>
    </div>
  );
}
