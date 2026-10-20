import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { productFixtures } from "@/data/mock/fixtures/products";
import { ProductDetail } from "./product-detail";

const product = productFixtures[1]!; // Bois Fumé Précieux
const related = productFixtures.filter((p) => p.family === product.family && p.id !== product.id).slice(0, 3);

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});

describe("ProductDetail", () => {
  it("leads with the scent: name as the one h1, its family, tagline and description", () => {
    render(<ProductDetail product={product} related={[]} />);
    expect(screen.getByRole("heading", { level: 1, name: product.name })).toBeInTheDocument();
    expect(screen.getByText(product.tagline)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.family, "i"))).toBeInTheDocument();
  });

  it("shows the notes pyramid in order, top then heart then base, from the product's own notes", () => {
    render(<ProductDetail product={product} related={[]} />);
    const list = screen.getByRole("list", { name: /fragrance notes/i });
    const rows = [...list.querySelectorAll("li")].map((li) => li.textContent);
    expect(rows).toEqual([`Top${product.notes.top.join(", ")}`, `Heart${product.notes.heart.join(", ")}`, `Base${product.notes.base.join(", ")}`]);
  });

  it("shows the real photographs with descriptive alt text, and never the painted hero artwork", () => {
    const { container } = render(<ProductDetail product={product} related={[]} />);
    const imgs = [...container.querySelectorAll("img")];
    expect(imgs.length).toBeGreaterThanOrEqual(1);
    for (const img of imgs) {
      expect(img.getAttribute("alt")?.length).toBeGreaterThan(8);
      expect(decodeURIComponent(img.getAttribute("src") ?? "")).not.toContain("painted");
    }
  });

  it("puts the way to buy next to the scent: sizes, price and add to bag", () => {
    render(<ProductDetail product={product} related={[]} />);
    expect(screen.getByRole("radio", { name: /30 ml/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add to bag/i })).toBeInTheDocument();
  });

  it("offers other scents from the same family underneath, when there are any", () => {
    render(<ProductDetail product={product} related={related} />);
    expect(screen.getByRole("heading", { level: 2, name: /you may also like/i })).toBeInTheDocument();
    for (const p of related) expect(screen.getByRole("link", { name: new RegExp(p.name) })).toHaveAttribute("href", `/product/${p.slug}`);
  });

  it("has no related section when there is nothing to relate", () => {
    render(<ProductDetail product={product} related={[]} />);
    expect(screen.queryByRole("heading", { name: /you may also like/i })).toBeNull();
  });
});
