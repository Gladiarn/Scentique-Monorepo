"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clampQuantity, type CartItem } from "./cart-logic";

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

/** Bump `version` and add a migration whenever the stored shape changes, so old carts are reset cleanly. */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: clampQuantity(i.quantity + quantity, item.maxQuantity) } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: clampQuantity(quantity, item.maxQuantity) }] };
        }),
      setQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.variantId === variantId ? { ...i, quantity: clampQuantity(quantity, i.maxQuantity) } : i)),
        })),
      remove: (variantId) => set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "scentique-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
