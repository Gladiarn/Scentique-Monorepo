import type { Product, ProductFilters } from "@scentique/shared";

export interface ProductRepository {
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findFeatured(): Promise<Product[]>;
}
