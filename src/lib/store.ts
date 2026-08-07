import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  price: number; // kobo
  discount: number;
  quantity: number;
  size: string | null;
  color: string | null;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  sessionId: string;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
  deliveryFee: () => number;
  total: () => number;
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 15);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: generateSessionId(),

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity = Math.min(
            updated[existingIndex].quantity + item.quantity,
            item.maxStock
          );
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              { ...item, id: generateId() },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => {
        return get().items.reduce((sum, item) => {
          const discountPrice = Math.round(item.price * (1 - item.discount / 100));
          return sum + discountPrice * item.quantity;
        }, 0);
      },

      totalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      deliveryFee: () => 150000, // ₦1,500 in kobo

      total: () => {
        return get().subtotal() + get().deliveryFee();
      },
    }),
    {
      name: 'shein-cart-storage',
      partialize: (state) => ({ items: state.items, sessionId: state.sessionId }),
    }
  )
);
