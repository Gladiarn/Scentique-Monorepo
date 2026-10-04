import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { AccountGate } from "@/features/account/account-gate";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="pt-44 pb-20 md:pt-48 md:pb-28">
      <AccountGate>{children}</AccountGate>
    </Container>
  );
}
