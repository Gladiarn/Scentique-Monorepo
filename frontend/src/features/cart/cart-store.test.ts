import { beforeEach, describe, expect, it } from "vitest";
import { useCart } from "./cart-store";

const base = {
  variantId: "v1",
  productSlug: "ambre-fume",
  productName: "Ambre Fumé",
  sizeMl: 50,
  concentration: "eau_de_parfum" as const,
  unitPriceCents: 9200,
  maxQuantity: 3,
};

describe("cart store", () => {
  beforeEach(() => useCart.getState().clear());

  it("adds a new line", () => {
    useCart.getState().add(base);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0].quantity).toBe(1);
  });

  it("merges repeat adds of the same variant and never exceeds stock", () => {
    const { add } = useCart.getState();
    add(base);
    add(base, 5);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0].quantity).toBe(3);
  });

  it("clamps setQuantity to at least one", () => {
    useCart.getState().add(base);
    useCart.getState().setQuantity("v1", 0);
    expect(useCart.getState().items[0].quantity).toBe(1);
  });

  it("removes a line and clears the cart", () => {
    useCart.getState().add(base);
    useCart.getState().remove("v1");
    expect(useCart.getState().items).toHaveLength(0);
    useCart.getState().add(base);
    useCart.getState().clear();
    expect(useCart.getState().items).toHaveLength(0);
  });
});
