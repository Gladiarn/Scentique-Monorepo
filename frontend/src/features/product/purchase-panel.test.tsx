import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { Product } from "@scentique/shared";
import { useCart } from "@/features/cart/cart-store";
import { PurchasePanel } from "./purchase-panel";

const product = {
  id: "p", slug: "bois-fume", name: "Bois Fumé", family: "woody",
  variants: [
    { id: "v30", sku: "A", sizeMl: 30, concentration: "eau_de_parfum", priceCents: 8800, stock: 5 },
    { id: "v50", sku: "B", sizeMl: 50, concentration: "eau_de_parfum", priceCents: 12800, stock: 5 },
    { id: "v50x", sku: "C", sizeMl: 50, concentration: "extrait", priceCents: 15800, stock: 0 },
  ],
} as unknown as Product;

beforeEach(() => useCart.setState({ items: [] }));

describe("PurchasePanel", () => {
  it("starts on the first size and concentration, with its price", () => {
    render(<PurchasePanel product={product} />);
    expect(screen.getByRole("radio", { name: "30 ml" })).toBeChecked();
    expect(screen.getByRole("radio", { name: /eau de parfum/i })).toBeChecked();
    expect(screen.getByText("$88.00")).toBeInTheDocument();
  });

  it("changes the price and the concentrations on offer when another size is chosen", async () => {
    render(<PurchasePanel product={product} />);
    expect(screen.getAllByRole("radio", { name: /parfum|extrait/i })).toHaveLength(1);
    await userEvent.click(screen.getByRole("radio", { name: "50 ml" }));
    expect(screen.getByText("$128.00")).toBeInTheDocument();
    expect(screen.getAllByRole("radio", { name: /parfum|extrait/i })).toHaveLength(2);
  });

  it("adds the chosen variant to the bag and says so, with a way to the bag", async () => {
    render(<PurchasePanel product={product} />);
    await userEvent.click(screen.getByRole("radio", { name: "50 ml" }));
    await userEvent.click(screen.getByRole("button", { name: /add to bag/i }));
    expect(useCart.getState().items).toEqual([
      expect.objectContaining({ variantId: "v50", productSlug: "bois-fume", productName: "Bois Fumé", sizeMl: 50, unitPriceCents: 12800, maxQuantity: 5, quantity: 1 }),
    ]);
    expect(screen.getByRole("status")).toHaveTextContent(/added to bag/i);
    expect(screen.getByRole("link", { name: /view bag/i })).toHaveAttribute("href", "/cart");
  });

  it("cannot add a sold-out variant", async () => {
    render(<PurchasePanel product={product} />);
    await userEvent.click(screen.getByRole("radio", { name: "50 ml" }));
    await userEvent.click(screen.getByRole("radio", { name: /extrait/i }));
    const button = screen.getByRole("button", { name: /sold out/i });
    expect(button).toBeDisabled();
    expect(useCart.getState().items).toHaveLength(0);
  });
});
