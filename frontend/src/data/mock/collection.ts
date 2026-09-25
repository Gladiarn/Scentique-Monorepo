import type { Collection } from "@scentique/shared";
import type { CollectionRepository } from "../repositories/collection";
import { collectionFixtures } from "./fixtures/collections";
import { simulate, type SimulateOptions } from "./simulate";

export class MockCollectionRepository implements CollectionRepository {
  constructor(private readonly options: SimulateOptions = {}) {}
  findAll(): Promise<Collection[]> {
    return simulate(collectionFixtures, this.options);
  }
}
