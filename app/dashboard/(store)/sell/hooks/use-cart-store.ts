import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import { Items } from '../(store)/pos/get-items';
import { produce } from 'immer';
import { debounce } from 'lodash';
import { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateQuantityDebounced: (productId: string, quantity: number) => void;
  updateDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

const immerSet = (fn: (state: CartStore) => void) => (state: CartStore) =>
  produce(state, fn);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set(
          immerSet((state) => {
            const existingItem = state.items.find(
              (item) => item.product.id === product.id
            );
            if (existingItem) {
              if (existingItem.quantity < product.quantityInStock) {
                existingItem.quantity += 1;
              }
            } else {
              state.items.push({ product, quantity: 1, discount: 0 });
            }
          })
        ),

      removeItem: (productId) =>
        set(
          immerSet((state) => {
            state.items = state.items.filter(
              (item) => item.product.id !== productId
            );
          })
        ),

      updateQuantity: (productId, quantity) =>
        set(
          immerSet((state) => {
            const item = state.items.find(
              (item) => item.product.id === productId
            );
            if (item) {
              item.quantity = Math.max(
                0,
                Math.min(quantity, item.product.quantityInStock)
              );
              if (item.quantity === 0) {
                state.items = state.items.filter(
                  (i) => i.product.id !== productId
                );
              }
            }
          })
        ),

      updateQuantityDebounced: debounce(
        (productId: string, quantity: number) => {
          get().updateQuantity(productId, quantity);
        },
        300
      ),

      updateDiscount: (productId, discount) =>
        set(
          immerSet((state) => {
            const item = state.items.find(
              (item) => item.product.id === productId
            );
            if (item) {
              item.discount = Math.max(
                0,
                Math.min(discount, item.product.sellingPrice)
              );
            }
          })
        ),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) =>
            total + (item.product.sellingPrice - item.discount) * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage:
        typeof window !== 'undefined'
          ? {
              getItem: (key: string) => {
                const value = window.localStorage.getItem(key);
                return value ? JSON.parse(value) : null;
              },
              setItem: (key: string, value: unknown) => {
                window.localStorage.setItem(key, JSON.stringify(value));
              },
              removeItem: (key: string) => {
                window.localStorage.removeItem(key);
              },
            }
          : undefined,
    }
  )
);
