import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";
import { CheckoutView } from "@/features/checkout/checkout-view";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <Container>
        <PageTitle>Checkout</PageTitle>
      </Container>
      <CheckoutView />
    </>
  );
}
