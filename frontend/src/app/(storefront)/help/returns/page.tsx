import type { Metadata } from "next";
import { InfoPage } from "@/features/info/info-page";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns" accent="and exchanges" lead="If a scent is not right for you, here is what to do.">
      <p>Unopened bottles can be returned within a set period from delivery. Please keep the original packaging.</p>
      <p>Opened bottles cannot be returned for hygiene reasons, but we will always help if a bottle arrives damaged or faulty.</p>
      <p className="text-sm text-muted">Placeholder policy: the return window and process are still to be confirmed.</p>
    </InfoPage>
  );
}
