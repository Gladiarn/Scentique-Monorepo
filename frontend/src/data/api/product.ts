import type { ProductRepository } from "../repositories/product";

const notReady = (): never => {
  throw new Error("ApiProductRepository is not implemented yet (backend milestone M2)");
};

export class ApiProductRepository implements ProductRepository {
  findAll = notReady;
  findBySlug = notReady;
  findFeatured = notReady;
  findHeroFeatured = notReady;
  findBestSellers = notReady;
}
