import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BagLink } from "./bag-link";
import { useCart } from "./cart-store";

beforeEach(() => useCart.setState({ items: [] }));

describe("BagLink", () => {
  it("links to the bag and says how many items it holds, in its accessible name", () => {
    render(<BagLink />);
    expect(screen.getByRole("link", { name: "Bag, 0 items" })).toHaveAttribute("href", "/cart");
  });

  it("counts every unit and says 'item' for one", () => {
    render(<BagLink />);
    act(() => {
      useCart.setState({ items: [{ variantId: "a", productSlug: "a", productName: "A", sizeMl: 30, concentration: "extrait", unitPriceCents: 1, maxQuantity: 5, quantity: 1 }] });
    });
    expect(screen.getByRole("link", { name: "Bag, 1 item" })).toBeInTheDocument();
    act(() => {
      useCart.setState({ items: [{ variantId: "a", productSlug: "a", productName: "A", sizeMl: 30, concentration: "extrait", unitPriceCents: 1, maxQuantity: 5, quantity: 3 }] });
    });
    expect(screen.getByRole("link", { name: "Bag, 3 items" })).toBeInTheDocument();
  });
});
