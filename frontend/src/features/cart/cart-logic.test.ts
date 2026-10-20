import { describe, expect, it } from "vitest";
import { clampQuantity, FREE_SHIPPING_CENTS, itemCount, shippingCents, subtotalCents, totalCents, type CartItem } from "./cart-logic";

const item = (overrides: Partial<CartItem>): CartItem => ({
  variantId: "v",
  productSlug: "s",
  productName: "Scent",
  sizeMl: 50,
  concentration: "eau_de_parfum",
  unitPriceCents: 9000,
  maxQuantity: 5,
  quantity: 1,
  ...overrides,
});

describe("clampQuantity", () => {
  it("keeps quantity between one and the stock on hand", () => {
    expect(clampQuantity(0, 5)).toBe(1);
    expect(clampQuantity(9, 3)).toBe(3);
    expect(clampQuantity(2.7, 5)).toBe(2);
  });

  it("never allows more than the per-line maximum", () => {
    expect(clampQuantity(50, 100)).toBe(10);
  });
});

describe("totals", () => {
  it("multiplies unit price by quantity per line and sums the lines", () => {
    const items = [item({ unitPriceCents: 9000, quantity: 2 }), item({ unitPriceCents: 4000, quantity: 1 })];
    expect(subtotalCents(items)).toBe(22000);
    expect(itemCount(items)).toBe(3);
  });

  it("charges standard shipping under the free threshold and none above it", () => {
    expect(shippingCents(subtotalCents([item({ unitPriceCents: 9000 })]))).toBe(1200);
    expect(shippingCents(FREE_SHIPPING_CENTS)).toBe(0);
  });

  it("charges no shipping on an empty cart", () => {
    expect(shippingCents(0)).toBe(0);
    expect(totalCents([])).toBe(0);
  });

  it("total is subtotal plus shipping", () => {
    expect(totalCents([item({ unitPriceCents: 9000, quantity: 1 })])).toBe(9000 + 1200);
    expect(totalCents([item({ unitPriceCents: 9000, quantity: 2 })])).toBe(18000);
  });
});
