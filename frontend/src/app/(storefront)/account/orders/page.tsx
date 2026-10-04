import type { Metadata } from "next";
import { Em } from "@/components/ui/em";
import { OrdersView } from "@/features/account/orders-view";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div>
      <h1 className="font-display text-3xl md:text-[length:var(--text-4xl)]">
        Your <Em>orders</Em>
      </h1>
      <div className="mt-10">
        <OrdersView />
      </div>
    </div>
  );
}
