import type { Metadata } from "next";
import { InfoPage } from "@/features/info/info-page";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping" accent="and delivery" lead="How and when your order reaches you.">
      <p>Standard delivery takes three to five working days. Express delivery takes one to two working days.</p>
      <p>Orders over $150 ship free. Smaller orders pay a flat standard rate.</p>
      <p className="text-sm text-muted">Placeholder policy: shipping regions and final rates are still to be confirmed.</p>
    </InfoPage>
  );
}
