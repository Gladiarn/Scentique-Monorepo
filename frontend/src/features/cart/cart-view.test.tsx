import { render, screen } from "@testing-library/react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CartView } from "./cart-view";
import { useCart } from "./cart-store";
import type { CartItem } from "./cart-logic";

const item = (over: Partial<CartItem> = {}): CartItem => ({
  variantId: "v50", productSlug: "bois-fume", productName: "Bois Fumé", sizeMl: 50, concentration: "eau_de_parfum", unitPriceCents: 12800, maxQuantity: 5, quantity: 1, ...over,
});

beforeEach(() => useCart.setState({ items: [] }));

describe("CartView", () => {
  it("says the bag is empty and points to the shop", () => {
    render(<CartView />);
    expect(screen.getByText(/your bag is empty/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /shop all perfumes/i })).toHaveAttribute("href", "/shop");
  });

  it("lists each line: scent as a link, size and concentration, quantity and the line price", () => {
    useCart.setState({ items: [item({ quantity: 2 })] });
    render(<CartView />);
    expect(screen.getByRole("link", { name: "Bois Fumé" })).toHaveAttribute("href", "/product/bois-fume");
    expect(screen.getByText(/50 ml/)).toBeInTheDocument();
    expect(screen.getByText(/eau de parfum/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByText("$256.00").length).toBeGreaterThan(0);
  });

  it("changes quantity within stock, and removes a line", async () => {
    useCart.setState({ items: [item({ maxQuantity: 2 })] });
    render(<CartView />);
    await userEvent.click(screen.getByRole("button", { name: /increase quantity of bois fumé/i }));
    expect(useCart.getState().items[0]!.quantity).toBe(2);
    await userEvent.click(screen.getByRole("button", { name: /increase quantity of bois fumé/i }));
    expect(useCart.getState().items[0]!.quantity).toBe(2);
    await userEvent.click(screen.getByRole("button", { name: /decrease quantity of bois fumé/i }));
    expect(useCart.getState().items[0]!.quantity).toBe(1);
    await userEvent.click(screen.getByRole("button", { name: /remove bois fumé/i }));
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("shows subtotal, shipping and total, with the shipping rule from the shipping page", () => {
    useCart.setState({ items: [item({ unitPriceCents: 9000 })] });
    render(<CartView />);
    const summary = screen.getByRole("region", { name: /order summary/i });
    expect(summary).toHaveTextContent("Subtotal$90.00");
    expect(summary).toHaveTextContent("Shipping$12.00");
    expect(summary).toHaveTextContent("Total$102.00");
    expect(screen.getByText(/\$60\.00 away from free shipping/i)).toBeInTheDocument();
  });

  it("ships free over $150, and says so instead of nudging", () => {
    useCart.setState({ items: [item({ unitPriceCents: 16000 })] });
    render(<CartView />);
    expect(screen.getByRole("region", { name: /order summary/i })).toHaveTextContent("ShippingFree");
    expect(screen.queryByText(/away from free shipping/i)).toBeNull();
  });

  it("leads to checkout", () => {
    useCart.setState({ items: [item()] });
    render(<CartView />);
    expect(screen.getByRole("link", { name: /checkout/i })).toHaveAttribute("href", "/checkout");
  });

  it("hydrates server HTML without store warnings: the empty bag shown before the saved one can be read is a stable value", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const container = document.createElement("div");
    container.innerHTML = renderToString(<CartView />);
    expect(container.textContent).toContain("Your bag is empty");
    await act(async () => {
      hydrateRoot(container, <CartView />);
    });
    expect(errors.mock.calls.map((c) => String(c[0])).filter((m) => /getServerSnapshot|infinite loop/i.test(m))).toEqual([]);
    errors.mockRestore();
  });
});
