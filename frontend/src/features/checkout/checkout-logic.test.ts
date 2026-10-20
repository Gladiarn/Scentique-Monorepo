import { describe, expect, it } from "vitest";
import { EXPRESS_SHIPPING_CENTS, deliveryCents, orderTotalCents } from "./checkout-logic";
import type { CartItem } from "../cart/cart-logic";

const item = (unitPriceCents: number, quantity = 1): CartItem => ({
  variantId: "v", productSlug: "s", productName: "S", sizeMl: 50, concentration: "eau_de_parfum", unitPriceCents, maxQuantity: 5, quantity,
});

describe("deliveryCents", () => {
  it("follows the bag's shipping rule for standard delivery", () => {
    expect(deliveryCents(5000, "standard")).toBe(1200);
    expect(deliveryCents(15000, "standard")).toBe(0);
  });

  it("charges the flat express rate, even above the free-shipping line", () => {
    expect(deliveryCents(5000, "express")).toBe(EXPRESS_SHIPPING_CENTS);
    expect(deliveryCents(20000, "express")).toBe(EXPRESS_SHIPPING_CENTS);
  });

  it("charges nothing for an empty bag", () => {
    expect(deliveryCents(0, "express")).toBe(0);
  });
});

describe("orderTotalCents", () => {
  it("adds the chosen delivery to the subtotal", () => {
    const items = [item(5000, 2)];
    expect(orderTotalCents(items, "standard")).toBe(11200);
    expect(orderTotalCents(items, "express")).toBe(10000 + EXPRESS_SHIPPING_CENTS);
  });
});
