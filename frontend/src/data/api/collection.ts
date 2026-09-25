import type { CollectionRepository } from "../repositories/collection";

const notReady = (): never => {
  throw new Error("ApiCollectionRepository is not implemented yet (backend milestone M2)");
};

export class ApiCollectionRepository implements CollectionRepository {
  findAll = notReady;
}
