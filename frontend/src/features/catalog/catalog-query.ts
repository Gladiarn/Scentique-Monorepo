import type { Gender, Product, ProductFilters, ScentFamily } from "@scentique/shared";

export const SORTS = ["featured", "price-asc", "price-desc", "newest"] as const;
export type CatalogSort = (typeof SORTS)[number];

export const SORT_LABELS: Record<CatalogSort, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  newest: "Newest",
};

const FAMILIES: ScentFamily[] = ["woody", "floral", "citrus", "oud"];
const GENDERS: Gender[] = ["feminine", "masculine", "unisex"];

export interface CatalogQuery {
  family?: ScentFamily;
  gender?: Gender;
  /** Upper price bound in cents, from the URL's `max` (dollars). */
  maxPriceCents?: number;
  sort: CatalogSort;
}

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
  return allowed.find((a) => a === value);
}

/** Reads the catalogue state from the URL. Unknown values are dropped rather than passed through. */
export function parseCatalogQuery(params: RawParams): CatalogQuery {
  const family = oneOf(first(params.family), FAMILIES);
  const gender = oneOf(first(params.gender), GENDERS);
  const dollars = Number(first(params.max));
  const maxPriceCents = Number.isFinite(dollars) && dollars > 0 ? Math.round(dollars * 100) : undefined;
  const sort = oneOf(first(params.sort), SORTS) ?? "featured";
  return { family, gender, maxPriceCents, sort };
}

/** What the repository filters on. Sorting happens after the fetch, so it is not part of the filters. */
export function toProductFilters(query: CatalogQuery): ProductFilters {
  const { family, gender, maxPriceCents } = query;
  return { family, gender, maxPriceCents };
}

export function lowestPriceCents(product: Pick<Product, "variants">): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

/** Returns a new array; the input is never mutated. */
export function sortProducts(products: Product[], sort: CatalogSort): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => lowestPriceCents(a) - lowestPriceCents(b));
    case "price-desc":
      return copy.sort((a, b) => lowestPriceCents(b) - lowestPriceCents(a));
    case "newest":
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "featured":
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

/** A scent is sold out only when every size and concentration is out of stock. */
export function isSoldOut(product: Pick<Product, "variants">): boolean {
  return product.variants.every((v) => v.stock === 0);
}
