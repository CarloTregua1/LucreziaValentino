"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalCents: () => number;
}

function isSameItem(a: CartItem, b: { productId: string; variantId?: string }) {
  return a.productId === b.productId && a.variantId === b.variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => isSameItem(i, item));
          if (existing) {
            return {
              items: state.items.map((i) =>
                isSameItem(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter((i) => !isSameItem(i, { productId, variantId })),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !isSameItem(i, { productId, variantId }))
              : state.items.map((i) =>
                  isSameItem(i, { productId, variantId }) ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalCents: () =>
        get().items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    }),
    { name: "lucrezia-cart" }
  )
);
