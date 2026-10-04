import type { Metadata } from "next";
import { GlassPanel } from "@/components/ui/glass-panel";
import { InfoPage } from "@/features/info/info-page";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <InfoPage title="Get in" accent="touch" lead="Questions about a scent, an order or a gift? Write to us and a person will reply.">
      <GlassPanel className="p-7 md:p-9">
        <p className="font-display text-2xl">Email</p>
        <p className="mt-2 text-ink/80">Placeholder address, to be replaced once the house has its own inbox.</p>
      </GlassPanel>
      <p className="text-sm text-muted">Replies usually arrive within two working days.</p>
    </InfoPage>
  );
}
