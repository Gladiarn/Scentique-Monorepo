import type { Concentration } from "@scentique/shared";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatMoney(cents: number): string {
  return usd.format(cents / 100);
}

const CONCENTRATION_LABELS: Record<Concentration, string> = {
  eau_de_toilette: "Eau de Toilette",
  eau_de_parfum: "Eau de Parfum",
  extrait: "Extrait de Parfum",
};

export function formatConcentration(concentration: Concentration): string {
  return CONCENTRATION_LABELS[concentration];
}
