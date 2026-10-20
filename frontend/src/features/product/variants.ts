import type { Concentration, Product, Variant } from "@scentique/shared";

export function availableSizes(product: Pick<Product, "variants">): number[] {
  return [...new Set(product.variants.map((v) => v.sizeMl))].sort((a, b) => a - b);
}

export function availableConcentrations(product: Pick<Product, "variants">, sizeMl: number): Concentration[] {
  return product.variants.filter((v) => v.sizeMl === sizeMl).map((v) => v.concentration);
}

export function resolveVariant(product: Pick<Product, "variants">, sizeMl: number, concentration: Concentration): Variant | null {
  return product.variants.find((v) => v.sizeMl === sizeMl && v.concentration === concentration) ?? null;
}
