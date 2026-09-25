import type { Product, ProductFilters } from "@scentique/shared";

export interface ProductRepository {
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findFeatured(): Promise<Product[]>;
  /** Top-selling scents, best first. The API ranks by sales; the mock uses a fixed list. */
  findBestSellers(limit?: number): Promise<Product[]>;
}
