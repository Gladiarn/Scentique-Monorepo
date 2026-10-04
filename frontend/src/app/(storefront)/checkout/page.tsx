import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { PageTitle } from "@/components/ui/page-title";
import { CheckoutForm } from "@/features/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Container className="py-20 md:py-28">
      <PageTitle>
        <Em>Checkout</Em>
      </PageTitle>
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </Container>
  );
}
