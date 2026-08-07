const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Server-side fetch (bypasses client-side fetch for SSR)
export async function serverFetch<T>(url: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${base}${url}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface FetchProductsParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  rating?: number;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: string;
  search?: string;
}

export async function fetchProducts(params: FetchProductsParams = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  return apiFetch(`/api/products?${searchParams.toString()}`);
}

export async function fetchProduct(slug: string) {
  return apiFetch(`/api/products/${slug}`);
}

export async function fetchWishlist() {
  return apiFetch('/api/wishlist');
}

export async function toggleWishlist(productId: string) {
  return apiFetch('/api/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId: string) {
  return apiFetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' });
}

export async function syncCart(items: any[]) {
  return apiFetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

export async function initializeCheckout(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  items: any[];
}) {
  return apiFetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyPayment(reference: string) {
  return apiFetch(`/api/checkout/verify?reference=${reference}`);
}

export async function fetchOrders(page: number = 1) {
  return apiFetch(`/api/orders?page=${page}`);
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
