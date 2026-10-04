import type { Metadata } from "next";
import { OrderDetail } from "@/features/account/order-detail";

export const metadata: Metadata = { title: "Order" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetail orderId={id} />;
}
