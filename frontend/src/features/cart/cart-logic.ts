import type { Concentration } from "@scentique/shared";

export interface CartItem {
  variantId: string;
  productSlug: string;
  productName: string;
  sizeMl: number;
  concentration: Concentration;
  unitPriceCents: number;
  /** Stock at the time it was added, so the quantity control can never exceed what exists. */
  maxQuantity: number;
  quantity: number;
}

export const MAX_LINE_QUANTITY = 10;
export const FREE_SHIPPING_CENTS = 15000;
export const STANDARD_SHIPPING_CENTS = 1200;

export function clampQuantity(quantity: number, maxQuantity: number): number {
  const cap = Math.max(1, Math.min(MAX_LINE_QUANTITY, maxQuantity));
  return Math.min(cap, Math.max(1, Math.floor(quantity)));
}

export function lineTotalCents(item: Pick<CartItem, "unitPriceCents" | "quantity">): number {
  return item.unitPriceCents * item.quantity;
}

export function subtotalCents(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + lineTotalCents(item), 0);
}

/** Free shipping from $150. Shipping is a placeholder rate until real logistics are decided. */
export function shippingCents(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
}

export function totalCents(items: CartItem[]): number {
  const subtotal = subtotalCents(items);
  return subtotal + shippingCents(subtotal);
}

export function itemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
