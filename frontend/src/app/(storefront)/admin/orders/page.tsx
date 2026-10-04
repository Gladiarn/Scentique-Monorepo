import type { Metadata } from "next";
import { Em } from "@/components/ui/em";
import { OrdersTable } from "@/features/admin/orders-table";

export const metadata: Metadata = { title: "Orders · Admin" };

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl md:text-4xl">
        <Em>Orders</Em>
      </h1>
      <OrdersTable />
    </div>
  );
}
