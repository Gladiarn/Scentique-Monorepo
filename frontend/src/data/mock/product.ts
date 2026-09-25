import type { Product, ProductFilters } from "@scentique/shared";
import type { ProductRepository } from "../repositories/product";
import { productFixtures } from "./fixtures/products";
import { simulate, type SimulateOptions } from "./simulate";

export class MockProductRepository implements ProductRepository {
  constructor(private readonly options: SimulateOptions = {}) {}

  findAll(filters: ProductFilters = {}): Promise<Product[]> {
    const result = productFixtures.filter(
      (p) =>
        (!filters.family || p.family === filters.family) &&
        (!filters.gender || p.gender === filters.gender) &&
        (filters.maxPriceCents === undefined || Math.min(...p.variants.map((v) => v.priceCents)) <= filters.maxPriceCents),
    );
    return simulate(result, this.options);
  }

  findBySlug(slug: string): Promise<Product | null> {
    return simulate(productFixtures.find((p) => p.slug === slug) ?? null, this.options);
  }

  findFeatured(): Promise<Product[]> {
    return simulate(productFixtures.filter((p) => p.featured), this.options);
  }
}
