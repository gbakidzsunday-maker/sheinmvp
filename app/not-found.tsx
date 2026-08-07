import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-main py-20 text-center">
      <p className="text-8xl font-black text-[#FF3F6C] mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="flex gap-4 justify-center">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/shop" className="btn-outline">Browse Shop</Link>
      </div>
    </div>
  );
}
