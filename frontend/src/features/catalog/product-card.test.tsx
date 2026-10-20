import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { productFixtures } from "@/data/mock/fixtures/products";
import { ProductCard } from "./product-card";

describe("ProductCard", () => {
  it("is one link to the product page: photograph, family dot and name, and the price it starts from", () => {
    const product = productFixtures[0]!;
    render(<ProductCard product={product} />);
    const link = screen.getByRole("link", { name: new RegExp(product.name) });
    expect(link).toHaveAttribute("href", `/product/${product.slug}`);
    expect(link).toHaveTextContent(/From \$\d+\.\d{2}/);
    expect(link.querySelector("img")?.getAttribute("alt")?.length).toBeGreaterThan(8);
    expect(link.querySelectorAll("a")).toHaveLength(0);
  });

  it("says sold out, with no price, when every variant is out of stock", () => {
    const soldOut = { ...productFixtures[0]!, variants: productFixtures[0]!.variants.map((v) => ({ ...v, stock: 0 })) };
    render(<ProductCard product={soldOut} />);
    expect(screen.getByText("Sold out")).toBeInTheDocument();
    expect(screen.queryByText(/From \$/)).toBeNull();
  });
});
