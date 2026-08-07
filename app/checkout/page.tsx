'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/lib/store';
import { formatNaira, calculateDiscountPrice, DELIVERY_FEE } from '@/lib/utils';
import { initializeCheckout } from '@/lib/api';

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });

  const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  ];

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const displaySubtotal = subtotal();
  const displayDelivery = displaySubtotal >= 5000000 ? 0 : DELIVERY_FEE;
  const displayTotal = displaySubtotal + displayDelivery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const checkoutItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        title: item.title,
      }));

      const result = await initializeCheckout({
        ...form,
        items: checkoutItems,
      });

      if (result.success && result.authorizationUrl) {
        clearCart();
        window.location.href = result.authorizationUrl;
      } else {
        toast.error(result.error || 'Checkout failed. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Shipping info */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
            <p className="text-sm text-gray-500 mb-4">Guest checkout — no account needed!</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Chioma Adebayo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="08012345678"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Lekki"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="12 Admiralty Way, Lekki Phase 1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">State *</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">Payment Method</h2>
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#FF3F6C] flex items-center justify-center mt-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF3F6C]" />
              </div>
              <div>
                <p className="font-semibold text-sm">💳 Card Payment (Paystack)</p>
                <p className="text-xs text-gray-500 mt-1">
                  You will be redirected to Paystack to complete your card payment securely.
                  Visa, Mastercard, and Verve cards accepted.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              We only accept card payments for security. Bank transfer, USSD, and cash on delivery are not available.
            </p>
          </div>

          {/* Mobile: place order button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center py-4 lg:hidden"
          >
            {loading ? 'Processing...' : `Pay ${formatNaira(displayTotal)}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => {
                const itemPrice = calculateDiscountPrice(item.price, item.discount);
                return (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                        {item.size && ` • Size: ${item.size}`}
                        {item.color && ` • ${item.color}`}
                      </p>
                      <p className="font-semibold">{formatNaira(itemPrice * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">{formatNaira(displaySubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold">
                  {displayDelivery === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : formatNaira(displayDelivery)}
                </span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                <span className="font-bold">Total</span>
                <span className="font-black">{formatNaira(displayTotal)}</span>
              </div>
            </div>

            {/* Desktop: place order */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="btn-primary w-full text-center mt-6 hidden lg:block"
            >
              {loading ? 'Processing...' : `Pay ${formatNaira(displayTotal)}`}
            </button>

            <div className="mt-4 flex justify-center gap-1">
              <span className="text-xs">🔒 Secured by</span>
              <span className="text-xs font-bold">Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
