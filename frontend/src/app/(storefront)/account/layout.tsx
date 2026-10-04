import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { AccountGate } from "@/features/account/account-gate";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="py-20 md:py-28">
      <AccountGate>{children}</AccountGate>
    </Container>
  );
}
