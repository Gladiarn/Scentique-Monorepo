import type { Product, ProductFilters } from "@scentique/shared";
import type { ProductRepository, NewProduct } from "../repositories/product";
import { bestSellerSlugs } from "./fixtures/best-sellers";
import { heroFeaturedSlug } from "./fixtures/hero-featured";
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

  findBestSellers(limit = 4): Promise<Product[]> {
    const ranked = bestSellerSlugs
      .map((slug) => productFixtures.find((p) => p.slug === slug))
      .filter((p): p is Product => Boolean(p))
      .slice(0, limit);
    return simulate(ranked, this.options);
  }

  findHeroFeatured(): Promise<Product | null> {
    return simulate(productFixtures.find((p) => p.slug === heroFeaturedSlug) ?? null, this.options);
  }

  create(input: NewProduct): Promise<Product> {
    const slug = input.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const product: Product = {
      ...input,
      id: `p-${productFixtures.length + 1}`,
      slug,
      media: input.media ?? [],
      featured: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    productFixtures.push(product);
    return simulate(product, this.options);
  }

  findFeatured(): Promise<Product[]> {
    return simulate(productFixtures.filter((p) => p.featured), this.options);
  }
}
