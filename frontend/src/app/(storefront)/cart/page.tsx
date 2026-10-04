import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { PageTitle } from "@/components/ui/page-title";
import { CartView } from "@/features/cart/cart-view";

export const metadata: Metadata = { title: "Your bag" };

export default function CartPage() {
  return (
    <Container className="pt-44 pb-20 md:pt-48 md:pb-28">
      <PageTitle>
        Your <Em>bag</Em>
      </PageTitle>
      <div className="mt-12">
        <CartView />
      </div>
    </Container>
  );
}
