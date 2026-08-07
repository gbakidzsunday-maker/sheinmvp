'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { fetchOrders } from '@/lib/api';
import { formatNaira } from '@/lib/utils';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
        .then((data) => setOrders(data.orders || []))
        .catch(() => {})
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
        <p className="text-6xl mb-4">📦</p>
        <h1 className="text-2xl font-bold mb-2">Sign in to view orders</h1>
        <Link href="/account" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-6xl mb-4">📭</p>
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
        <Link href="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return `badge ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="container-main py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">Order #{order.orderNumber}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-NG', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <span className={statusBadge(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              {order.items?.slice(0, 3).map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <img
                    src={item.product?.images?.[0]?.url || '/placeholder.png'}
                    alt={item.product?.title}
                    className="w-10 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product?.title}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                      {item.size && ` • Size: ${item.size}`}
                      {item.color && ` • ${item.color}`}
                    </p>
                  </div>
                  <span className="font-semibold">{formatNaira(item.price * item.quantity)}</span>
                </div>
              ))}
              {order.items?.length > 3 && (
                <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
              )}
            </div>

            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
              <span className="text-sm font-bold">Total: {formatNaira(order.total)}</span>
              <span className="text-xs text-gray-400">
                Delivery: {formatNaira(order.deliveryFee)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
