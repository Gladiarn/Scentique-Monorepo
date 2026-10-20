import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { productFixtures } from "@/data/mock/fixtures/products";
import type { CatalogQuery } from "./catalog-query";
import { ShopView } from "./shop-view";

const query = (over: Partial<CatalogQuery> = {}): CatalogQuery => ({ sort: "featured", page: 1, ...over });
const products = productFixtures.slice(0, 4);

describe("ShopView", () => {
  it("offers each family as a filter, marks the chosen one, and keeps the sort", () => {
    render(<ShopView products={products} total={4} query={query({ family: "woody", sort: "price-asc" })} pageCount={1} />);
    const nav = screen.getByRole("navigation", { name: /filter by family/i });
    expect(nav.querySelector("a[aria-current=true]")).toHaveTextContent("Woody");
    expect(screen.getByRole("link", { name: "Oud" })).toHaveAttribute("href", "/shop?family=oud&sort=price-asc");
    expect(screen.getByRole("link", { name: "All" })).toHaveAttribute("href", "/shop?sort=price-asc");
  });

  it("offers every sort, marking the current one", () => {
    render(<ShopView products={products} total={4} query={query({ sort: "newest" })} pageCount={1} />);
    const nav = screen.getByRole("navigation", { name: /sort/i });
    expect(nav.querySelector("a[aria-current=true]")).toHaveTextContent("Newest");
    expect(screen.getByRole("link", { name: "Price: low to high" })).toHaveAttribute("href", "/shop?sort=price-asc");
  });

  it("shows one card per scent and says how many there are", () => {
    render(<ShopView products={products} total={10} query={query()} pageCount={2} />);
    expect(screen.getAllByRole("listitem").filter((li) => li.querySelector("h3"))).toHaveLength(4);
    expect(screen.getByText("10 scents")).toBeInTheDocument();
  });

  it("pages through the results, keeping the filters, with the current page marked", () => {
    render(<ShopView products={products} total={20} query={query({ family: "oud", page: 2 })} pageCount={3} />);
    const nav = screen.getByRole("navigation", { name: /pagination/i });
    expect(nav.querySelector("a[aria-current=page]")).toHaveTextContent("2");
    expect(screen.getByRole("link", { name: /next page/i })).toHaveAttribute("href", "/shop?family=oud&page=3");
    expect(screen.getByRole("link", { name: /previous page/i })).toHaveAttribute("href", "/shop?family=oud");
  });

  it("has no pagination when everything fits on one page", () => {
    render(<ShopView products={products} total={4} query={query()} pageCount={1} />);
    expect(screen.queryByRole("navigation", { name: /pagination/i })).toBeNull();
  });

  it("says plainly when nothing matches, and offers a way back", () => {
    render(<ShopView products={[]} total={0} query={query({ family: "citrus" })} pageCount={1} />);
    expect(screen.getByText(/no scents match these filters/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /clear filters/i })).toHaveAttribute("href", "/shop");
  });
});
