import type { Order, OrderInput } from "@scentique/shared";
import type { OrderRepository } from "../repositories/order";
import { sampleOrders } from "./fixtures/sample-orders";
import { productFixtures } from "./fixtures/products";
import { simulate, type SimulateOptions } from "./simulate";

/** Orders live in memory for the session. A reload clears them, which is fine until the API exists. */
export class MockOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();
  private sequence = 1000;

  constructor(private readonly options: SimulateOptions = {}) {
    for (const order of sampleOrders(productFixtures, 200)) this.orders.set(order.id, order);
  }

  create(input: OrderInput): Promise<Order> {
    const id = `SC-${++this.sequence}`;
    const order: Order = { ...input, id, status: "pending", placedAt: new Date().toISOString() };
    this.orders.set(id, order);
    return simulate(order, this.options);
  }

  findById(id: string): Promise<Order | null> {
    return simulate(this.orders.get(id) ?? null, this.options);
  }

  findAll(): Promise<Order[]> {
    const all = [...this.orders.values()].sort((a, b) => b.placedAt.localeCompare(a.placedAt));
    return simulate(all, this.options);
  }

  updateStatus(id: string, status: Order["status"]): Promise<Order | null> {
    const order = this.orders.get(id);
    if (!order) return simulate(null, this.options);
    const updated = { ...order, status };
    this.orders.set(id, updated);
    return simulate(updated, this.options);
  }

  findByEmail(email: string): Promise<Order[]> {
    const mine = [...this.orders.values()].filter((o) => o.email === email).sort((a, b) => b.placedAt.localeCompare(a.placedAt));
    return simulate(mine, this.options);
  }
}
