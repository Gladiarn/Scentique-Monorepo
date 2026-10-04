import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { CartView } from "@/features/cart/cart-view";

export const metadata: Metadata = { title: "Your bag" };

export default function CartPage() {
  return (
    <Container className="py-20 md:py-28">
      <h1 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">
        Your <Em>bag</Em>
      </h1>
      <div className="mt-12">
        <CartView />
      </div>
    </Container>
  );
}
