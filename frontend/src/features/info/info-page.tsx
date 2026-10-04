import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { PageTitle } from "@/components/ui/page-title";

/** Shared layout for About, contact and help pages: display title, a lead line, then content in a single readable column. */
export function InfoPage({ title, accent, lead, children }: { title: string; accent: string; lead: string; children: ReactNode }) {
  return (
    <Container className="pt-44 pb-24 md:pt-48 md:pb-32">
      <PageTitle>
        {title} <Em>{accent}</Em>
      </PageTitle>
      <p className="mt-8 max-w-2xl text-lg text-ink/80">{lead}</p>
      <div className="mt-16 max-w-2xl space-y-8 text-ink/80">{children}</div>
    </Container>
  );
}
