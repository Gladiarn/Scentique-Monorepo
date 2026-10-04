import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { CheckoutForm } from "@/features/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Container className="py-20 md:py-28">
      <h1 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">
        <Em>Checkout</Em>
      </h1>
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </Container>
  );
}
