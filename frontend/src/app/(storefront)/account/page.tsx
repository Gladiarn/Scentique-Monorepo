import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Em } from "@/components/ui/em";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="max-w-xl">
      <p className="font-display text-3xl md:text-[length:var(--text-4xl)]">
        Your <Em>account</Em>
      </p>
      <p className="mt-4 text-muted">Track your orders and keep addresses ready for checkout.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/account/orders" variant="secondary">View orders</Button>
        <Button href="/account/addresses" variant="ghost">Saved addresses</Button>
      </div>
    </div>
  );
}
