export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  price: number; // kobo
  discount: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isFlashSale: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: { url: string; alt: string | null }[];
  sizes: { size: string; stock: number }[];
  colors: { color: string; hex: string }[];
}

export interface ProductDetail extends ProductListItem {
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItemData {
  id: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  discount: number;
  quantity: number;
  size: string | null;
  color: string | null;
  maxStock: number;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    size: string | null;
    color: string | null;
    product: {
      title: string;
      slug: string;
      images: { url: string; alt: string | null }[];
    };
  }[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  rating?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'best-selling';
  page?: number;
  limit?: number;
}
