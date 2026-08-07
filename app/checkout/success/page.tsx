'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyPayment } from '@/lib/api';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }

    verifyPayment(reference)
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setOrderNumber(data.orderNumber || '');
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('failed'));
  }, [reference]);

  if (status === 'loading') {
    return (
      <div className="container-main py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#FF3F6C] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-lg font-semibold">Verifying your payment...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-6xl mb-4">❌</p>
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-6">Something went wrong with your payment. Please try again.</p>
        <Link href="/cart" className="btn-primary">
          Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-20 text-center">
      <p className="text-6xl mb-4">🎉</p>
      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
      {orderNumber && (
        <p className="text-lg font-semibold mb-6">
          Order Number: <span className="text-[#FF3F6C]">{orderNumber}</span>
        </p>
      )}
      <p className="text-sm text-gray-500 mb-8">
        A confirmation email will be sent shortly. Your order is being processed.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/orders" className="btn-primary">
          View Orders
        </Link>
        <Link href="/shop" className="btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container-main py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#FF3F6C] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-lg font-semibold">Verifying your payment...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
