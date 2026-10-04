import type { Metadata } from "next";
import { InfoPage } from "@/features/info/info-page";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <InfoPage title="A small house" accent="with a long process" lead="Scentique makes a small number of scents, slowly, from raw materials we want to show properly.">
      <p>We began with one idea: make fewer scents than we could. Each one starts with a single rare ingredient, a resin, a bark or a root, and the rest of the blend is built around it until nothing is left to take away.</p>
      <p>Batches are small on purpose. Every blend is mixed by hand in twelve-litre lots, rested for six weeks until it settles, then bottled and checked one at a time.</p>
      <p>The shelf is organised into four families, Woody, Floral, Citrus and Oud, so every bottle earns its place and a newcomer can find a starting point.</p>
    </InfoPage>
  );
}
