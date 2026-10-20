import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutView } from "./checkout-view";
import { useCart } from "../cart/cart-store";
import type { CartItem } from "../cart/cart-logic";

const item: CartItem = {
  variantId: "v50", productSlug: "bois-fume", productName: "Bois Fumé", sizeMl: 50, concentration: "eau_de_parfum", unitPriceCents: 12800, maxQuantity: 5, quantity: 1,
};

async function fillValid() {
  const type = (name: RegExp, value: string) => userEvent.type(screen.getByLabelText(name), value);
  await type(/email/i, "ada@example.com");
  await type(/full name/i, "Ada Lovelace");
  await type(/street address/i, "12 Rue Cler");
  await type(/city/i, "Paris");
  await type(/postcode/i, "75007");
  await type(/country/i, "France");
  await type(/card number/i, "4242 4242 4242 4242");
}

beforeEach(() => useCart.setState({ items: [item] }));

describe("CheckoutView", () => {
  it("says the bag is empty and points to the shop when there is nothing to buy", () => {
    useCart.setState({ items: [] });
    render(<CheckoutView />);
    expect(screen.getByText(/your bag is empty/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /shop all perfumes/i })).toHaveAttribute("href", "/shop");
  });

  it("summarises the bag and moves the total when express delivery is chosen", async () => {
    render(<CheckoutView />);
    const summary = screen.getByRole("region", { name: /order summary/i });
    expect(within(summary).getByText("Bois Fumé")).toBeInTheDocument();
    expect(within(summary).getByText("$140.00")).toBeInTheDocument(); // 128.00 + 12.00 standard
    await userEvent.click(screen.getByRole("radio", { name: /express/i }));
    expect(within(summary).getByText("$153.00")).toBeInTheDocument(); // 128.00 + 25.00
  });

  it("names every problem, keeps the bag, and does not place the order when the form is empty", async () => {
    const placeOrder = vi.fn().mockResolvedValue(undefined);
    render(<CheckoutView placeOrder={placeOrder} />);
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));
    expect(screen.getByText(/enter an email address/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-invalid", "true");
    expect(placeOrder).not.toHaveBeenCalled();
    expect(useCart.getState().items).toHaveLength(1);
  });

  it("places a valid order once, empties the bag and confirms in test mode without claiming an email", async () => {
    const placeOrder = vi.fn().mockResolvedValue(undefined);
    render(<CheckoutView placeOrder={placeOrder} />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));
    expect(await screen.findByRole("heading", { name: /thank you/i })).toBeInTheDocument();
    expect(placeOrder).toHaveBeenCalledTimes(1);
    expect(useCart.getState().items).toHaveLength(0);
    expect(screen.getByText(/test mode/i)).toBeInTheDocument();
    expect(screen.queryByText(/we.?ve emailed/i)).not.toBeInTheDocument();
  });

  it("keeps what was typed and the bag when placing the order fails", async () => {
    const placeOrder = vi.fn().mockRejectedValue(new Error("down"));
    render(<CheckoutView placeOrder={placeOrder} />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not place your order/i);
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Ada Lovelace");
    expect(useCart.getState().items).toHaveLength(1);
  });
});
