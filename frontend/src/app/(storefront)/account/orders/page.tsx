import type { Metadata } from "next";
import { Em } from "@/components/ui/em";
import { PageTitle } from "@/components/ui/page-title";
import { OrdersView } from "@/features/account/orders-view";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div>
      <PageTitle>
        Your <Em>orders</Em>
      </PageTitle>
      <div className="mt-10">
        <OrdersView />
      </div>
    </div>
  );
}
