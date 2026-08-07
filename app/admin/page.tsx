'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatNaira } from '@/lib/utils';

type Tab = 'orders' | 'products' | 'users';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = (session?.user as any)?.role === 'admin';

  useEffect(() => {
    if (isAdmin && activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAdmin, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders?limit=50');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container-main py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#FF3F6C] border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-6xl mb-4">🔒</p>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">Admin access only.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
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
    <div className="container-main py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/" className="text-sm text-[#FF3F6C] hover:underline">← Back to Store</Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        {[
          { key: 'orders', label: '📦 Orders' },
          { key: 'products', label: '👗 Products' },
          { key: 'users', label: '👥 Users' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`px-4 py-2 text-sm rounded-t-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[#FF3F6C] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="flex gap-2 mb-4">
            {['all', 'pending', 'paid', 'shipped', 'delivered'].map((s) => (
              <button
                key={s}
                className={`px-3 py-1 text-xs rounded-full border ${
                  s === 'all' ? 'border-[#FF3F6C] text-[#FF3F6C]' : 'border-gray-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-[#FF3F6C] border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-3 px-3 font-semibold">Order #</th>
                    <th className="py-3 px-3 font-semibold">Customer</th>
                    <th className="py-3 px-3 font-semibold">Total</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                    <th className="py-3 px-3 font-semibold">Date</th>
                    <th className="py-3 px-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 font-mono text-xs">{order.orderNumber}</td>
                      <td className="py-3 px-3">
                        <p className="font-medium">{order.name}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </td>
                      <td className="py-3 px-3 font-bold">{formatNaira(order.total)}</td>
                      <td className="py-3 px-3">
                        <span className={statusBadge(order.status)}>{order.status}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="text-center py-10 text-gray-500">No orders found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Products Tab — Simplified for MVP */}
      {activeTab === 'products' && (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Product management coming soon.</p>
          <p className="text-sm">
            For now, add products via the seed script:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">npm run db:seed</code>
          </p>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="text-center py-10">
          <p className="text-gray-500">User management coming soon.</p>
          <p className="text-sm mt-2">
            Default admin: admin@example.com / admin123
          </p>
        </div>
      )}
    </div>
  );
}
