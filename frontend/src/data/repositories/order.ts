import type { Order, OrderInput } from "@scentique/shared";

export interface OrderRepository {
  create(input: OrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByEmail(email: string): Promise<Order[]>;
}
