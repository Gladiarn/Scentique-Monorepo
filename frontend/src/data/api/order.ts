import type { OrderRepository } from "../repositories/order";

const notReady = (): never => {
  throw new Error("ApiOrderRepository is not implemented yet (backend milestone M2)");
};

export class ApiOrderRepository implements OrderRepository {
  create = notReady;
  findById = notReady;
}
