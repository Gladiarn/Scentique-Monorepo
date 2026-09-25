import type { Collection } from "@scentique/shared";

export interface CollectionRepository {
  findAll(): Promise<Collection[]>;
}
