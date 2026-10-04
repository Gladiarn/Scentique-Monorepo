import type { Product, ProductFilters } from "@scentique/shared";

export type NewProduct = Omit<Product, "id" | "slug" | "createdAt" | "featured" | "media"> & { media?: Product["media"] };

export interface ProductRepository {
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findFeatured(): Promise<Product[]>;
  /** The single scent featured in the landing hero, or null if none is set. The API returns the item flagged by the admin. */
  findHeroFeatured(): Promise<Product | null>;
  /** Top-selling scents, best first. The API ranks by sales; the mock uses a fixed list. */
  findBestSellers(limit?: number): Promise<Product[]>;
  /** Admin: adds a scent to the catalogue. */
  create(input: NewProduct): Promise<Product>;
}
