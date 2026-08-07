'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { registerUser } from '@/lib/api';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const result = await registerUser(form);
        if (result.success) {
          toast.success(result.message);
          setIsRegister(false);
          setForm({ name: '', email: '', password: '' });
        } else {
          toast.error(result.error || 'Registration failed');
        }
      } else {
        const result = await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        if (result?.error) {
          toast.error('Invalid email or password');
        } else {
          toast.success('Signed in successfully!');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container-main py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#FF3F6C] border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="container-main py-10 max-w-lg mx-auto">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[#FF3F6C]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-[#FF3F6C]">
              {(session.user.name || 'U')[0].toUpperCase()}
            </span>
          </div>
          <h1 className="text-xl font-bold mb-1">{session.user.name || 'Customer'}</h1>
          <p className="text-sm text-gray-500 mb-6">{session.user.email}</p>

          <div className="space-y-3">
            <Link href="/orders" className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors">
              <span className="font-semibold">📦 My Orders</span>
              <p className="text-xs text-gray-500 mt-0.5">View your order history</p>
            </Link>
            <Link href="/wishlist" className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors">
              <span className="font-semibold">❤️ My Wishlist</span>
              <p className="text-xs text-gray-500 mt-0.5">Products you love</p>
            </Link>
          </div>

          <button
            onClick={() => signOut()}
            className="mt-6 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-10 max-w-md mx-auto">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {isRegister ? 'Sign up to start shopping' : 'Sign in to your account'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Your name"
                required={isRegister}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              placeholder="you@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-center">
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setForm({ name: '', email: '', password: '' });
            }}
            className="text-sm text-[#FF3F6C] hover:underline"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="relative my-6">
          <hr className="border-gray-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">
            or
          </span>
        </div>

        <button
          onClick={() => signIn('google')}
          className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm font-semibold"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Demo: customer@example.com / customer123<br />
            Admin: admin@example.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
