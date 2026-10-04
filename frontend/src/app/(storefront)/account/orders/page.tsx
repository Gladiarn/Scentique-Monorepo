import type { Metadata } from "next";
import { Em } from "@/components/ui/em";
import { OrdersView } from "@/features/account/orders-view";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div>
      <p className="font-display text-3xl md:text-[length:var(--text-4xl)]">
        Your <Em>orders</Em>
      </p>
      <div className="mt-10">
        <OrdersView />
      </div>
    </div>
  );
}
