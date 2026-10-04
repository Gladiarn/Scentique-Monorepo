import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { Confirmation } from "@/features/checkout/confirmation";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { order } = await searchParams;
  const orderId = Array.isArray(order) ? order[0] ?? null : order ?? null;
  return (
    <Container className="py-20 md:py-28">
      <h1 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">
        Order <Em>confirmed</Em>
      </h1>
      <div className="mt-12">
        <Confirmation orderId={orderId} />
      </div>
    </Container>
  );
}
