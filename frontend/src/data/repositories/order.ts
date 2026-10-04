import type { Order, OrderInput } from "@scentique/shared";

export interface OrderRepository {
  create(input: OrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByEmail(email: string): Promise<Order[]>;
  /** Every order, newest first. Admin only. */
  findAll(): Promise<Order[]>;
  updateStatus(id: string, status: Order["status"]): Promise<Order | null>;
}
