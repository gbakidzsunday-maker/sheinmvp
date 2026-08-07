'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import { useCartStore } from '@/lib/store';
import { formatNaira, calculateDiscountPrice, DELIVERY_FEE } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, total, clearCart } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const displaySubtotal = subtotal();
  const displayDelivery = displaySubtotal >= 5000000 ? 0 : DELIVERY_FEE; // Free over ₦50k
  const displayTotal = displaySubtotal + displayDelivery;

  return (
    <div className="container-main py-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({totalItems()} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const itemPrice = calculateDiscountPrice(item.price, item.discount);
            const itemTotal = itemPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="card p-4 flex gap-4"
              >
                <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="text-sm font-semibold line-clamp-2 hover:text-[#FF3F6C] transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  {item.color && (
                    <p className="text-xs text-gray-500 mt-1">Color: {item.color}</p>
                  )}
                  {item.size && (
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-sm">{formatNaira(itemTotal)}</span>

                    <div className="flex items-center gap-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        >
                          <HiMinus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        >
                          <HiPlus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          removeItem(item.id);
                          toast.success('Removed from cart');
                        }}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <HiTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => {
              clearCart();
              toast.success('Cart cleared');
            }}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({totalItems()} items)</span>
                <span className="font-semibold">{formatNaira(displaySubtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-semibold">
                  {displayDelivery === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatNaira(displayDelivery)
                  )}
                </span>
              </div>

              {displayDelivery > 0 && (
                <p className="text-xs text-[#FF3F6C]">
                  Add {formatNaira(5000000 - displaySubtotal)} more for free delivery!
                </p>
              )}

              <hr className="border-gray-200" />

              <div className="flex justify-between text-base">
                <span className="font-bold">Total</span>
                <span className="font-black text-lg">{formatNaira(displayTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary w-full text-center mt-6"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <Link href="/shop" className="text-sm text-[#FF3F6C] hover:underline">
                Continue Shopping
              </Link>
            </div>

            <div className="mt-6 flex justify-center gap-2 text-xs text-gray-400">
              <span>🔒 Secure checkout</span>
              <span>•</span>
              <span>Powered by Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
