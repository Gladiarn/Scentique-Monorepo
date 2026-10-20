import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";
import { CartView } from "@/features/cart/cart-view";

export const metadata: Metadata = { title: "Bag" };

export default function CartPage() {
  return (
    <>
      <Container>
        <PageTitle>Your bag</PageTitle>
      </Container>
      <CartView />
    </>
  );
}
