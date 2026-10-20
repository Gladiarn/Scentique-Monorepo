import { describe, expect, it } from "vitest";
import type { Product } from "@scentique/shared";
import { isSoldOut, parseCatalogQuery, sortProducts, toProductFilters } from "./catalog-query";

const product = (overrides: Partial<Product> & Pick<Product, "slug">): Product => ({
  id: overrides.slug,
  name: overrides.slug,
  tagline: "",
  description: "",
  family: "woody",
  gender: "unisex",
  notes: { top: [], heart: [], base: [] },
  variants: [{ id: "v", sku: "s", sizeMl: 50, concentration: "eau_de_parfum", priceCents: 9000, stock: 1 }],
  media: [],
  featured: false,
  createdAt: "2026-01-01",
  ...overrides,
});

describe("parseCatalogQuery", () => {
  it("defaults to featured sort, page one, with no filters", () => {
    expect(parseCatalogQuery({})).toEqual({ sort: "featured", page: 1 });
  });

  it("reads the page number and ignores nonsense", () => {
    expect(parseCatalogQuery({ page: "3" }).page).toBe(3);
    expect(parseCatalogQuery({ page: "-2" }).page).toBe(1);
    expect(parseCatalogQuery({ page: "abc" }).page).toBe(1);
  });

  it("reads valid family, gender, price and sort values", () => {
    expect(parseCatalogQuery({ family: "oud", gender: "masculine", max: "150", sort: "price-asc" })).toEqual({
      family: "oud",
      gender: "masculine",
      maxPriceCents: 15000,
      sort: "price-asc",
      page: 1,
    });
  });

  it("ignores unknown values instead of passing them to the repository", () => {
    expect(parseCatalogQuery({ family: "vanilla", gender: "x", max: "abc", sort: "random" })).toEqual({ sort: "featured", page: 1 });
  });

  it("takes the first value when a param repeats", () => {
    expect(parseCatalogQuery({ family: ["floral", "oud"] })).toEqual({ family: "floral", sort: "featured", page: 1 });
  });
});

describe("toProductFilters", () => {
  it("drops the sort, which is applied after fetching", () => {
    expect(toProductFilters({ family: "citrus", sort: "newest", page: 1 })).toEqual({ family: "citrus" });
  });
});

describe("sortProducts", () => {
  const cheap = product({ slug: "cheap", variants: [{ id: "a", sku: "a", sizeMl: 50, concentration: "eau_de_parfum", priceCents: 5000, stock: 1 }], createdAt: "2026-01-01", featured: false });
  const pricey = product({ slug: "pricey", variants: [{ id: "b", sku: "b", sizeMl: 50, concentration: "extrait", priceCents: 20000, stock: 1 }], createdAt: "2025-01-01", featured: true });
  const fresh = product({ slug: "fresh", createdAt: "2026-06-01", featured: false });

  it("sorts by lowest variant price ascending and descending", () => {
    expect(sortProducts([pricey, cheap, fresh], "price-asc").map((p) => p.slug)).toEqual(["cheap", "fresh", "pricey"]);
    expect(sortProducts([cheap, pricey, fresh], "price-desc").map((p) => p.slug)).toEqual(["pricey", "fresh", "cheap"]);
  });

  it("sorts newest first", () => {
    expect(sortProducts([cheap, pricey, fresh], "newest").map((p) => p.slug)).toEqual(["fresh", "cheap", "pricey"]);
  });

  it("puts featured scents first, keeping the rest in order", () => {
    expect(sortProducts([cheap, pricey, fresh], "featured").map((p) => p.slug)).toEqual(["pricey", "cheap", "fresh"]);
  });

  it("does not mutate the input", () => {
    const input = [pricey, cheap];
    sortProducts(input, "price-asc");
    expect(input.map((p) => p.slug)).toEqual(["pricey", "cheap"]);
  });
});

describe("isSoldOut", () => {
  it("is sold out only when every variant has no stock", () => {
    const out = product({ slug: "out", variants: [{ id: "a", sku: "a", sizeMl: 50, concentration: "extrait", priceCents: 1, stock: 0 }] });
    const partly = product({
      slug: "partly",
      variants: [
        { id: "a", sku: "a", sizeMl: 50, concentration: "extrait", priceCents: 1, stock: 0 },
        { id: "b", sku: "b", sizeMl: 100, concentration: "extrait", priceCents: 1, stock: 2 },
      ],
    });
    expect(isSoldOut(out)).toBe(true);
    expect(isSoldOut(partly)).toBe(false);
  });
});
