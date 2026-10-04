import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { PageTitle } from "@/components/ui/page-title";
import { Confirmation } from "@/features/checkout/confirmation";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { order } = await searchParams;
  const orderId = Array.isArray(order) ? order[0] ?? null : order ?? null;
  return (
    <Container className="py-20 md:py-28">
      <PageTitle>
        Order <Em>confirmed</Em>
      </PageTitle>
      <div className="mt-12">
        <Confirmation orderId={orderId} />
      </div>
    </Container>
  );
}
