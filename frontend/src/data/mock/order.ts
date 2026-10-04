import type { Order, OrderInput } from "@scentique/shared";
import type { OrderRepository } from "../repositories/order";
import { simulate, type SimulateOptions } from "./simulate";

/** Orders live in memory for the session. A reload clears them, which is fine until the API exists. */
export class MockOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();
  private sequence = 1000;

  constructor(private readonly options: SimulateOptions = {}) {}

  create(input: OrderInput): Promise<Order> {
    const id = `SC-${++this.sequence}`;
    const order: Order = { ...input, id, status: "pending", placedAt: new Date().toISOString() };
    this.orders.set(id, order);
    return simulate(order, this.options);
  }

  findById(id: string): Promise<Order | null> {
    return simulate(this.orders.get(id) ?? null, this.options);
  }

  findByEmail(email: string): Promise<Order[]> {
    const mine = [...this.orders.values()].filter((o) => o.email === email).sort((a, b) => b.placedAt.localeCompare(a.placedAt));
    return simulate(mine, this.options);
  }
}
