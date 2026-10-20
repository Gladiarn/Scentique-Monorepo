import { shippingCents, subtotalCents, type CartItem } from "../cart/cart-logic";
import type { CheckoutValues } from "./checkout-schema";

/** Flat express rate. A placeholder until real logistics are decided, like the standard rate. */
export const EXPRESS_SHIPPING_CENTS = 2500;

export function deliveryCents(subtotal: number, delivery: CheckoutValues["delivery"]): number {
  if (subtotal === 0) return 0;
  return delivery === "express" ? EXPRESS_SHIPPING_CENTS : shippingCents(subtotal);
}

export function orderTotalCents(items: CartItem[], delivery: CheckoutValues["delivery"]): number {
  const subtotal = subtotalCents(items);
  return subtotal + deliveryCents(subtotal, delivery);
}
