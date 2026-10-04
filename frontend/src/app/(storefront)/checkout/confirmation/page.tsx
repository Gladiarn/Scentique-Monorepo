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
    <Container className="pt-44 pb-20 md:pt-48 md:pb-28">
      <PageTitle>
        Order <Em>confirmed</Em>
      </PageTitle>
      <div className="mt-12">
        <Confirmation orderId={orderId} />
      </div>
    </Container>
  );
}
