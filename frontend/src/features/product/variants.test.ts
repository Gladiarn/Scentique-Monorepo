import { describe, expect, it } from "vitest";
import type { Product, Variant } from "@scentique/shared";
import { availableConcentrations, availableSizes, resolveVariant } from "./variants";

const v = (overrides: Partial<Variant> & Pick<Variant, "id" | "sizeMl" | "concentration">): Variant => ({
  sku: overrides.id,
  priceCents: 10000,
  stock: 3,
  ...overrides,
});

const product = (variants: Variant[]) => ({ variants }) as Pick<Product, "variants">;

const shelf = product([
  v({ id: "50-edp", sizeMl: 50, concentration: "eau_de_parfum", priceCents: 9000 }),
  v({ id: "50-extrait", sizeMl: 50, concentration: "extrait", priceCents: 14000, stock: 0 }),
  v({ id: "100-edp", sizeMl: 100, concentration: "eau_de_parfum", priceCents: 15000 }),
]);

describe("availableSizes", () => {
  it("lists distinct sizes in ascending order", () => {
    expect(availableSizes(shelf)).toEqual([50, 100]);
  });
});

describe("availableConcentrations", () => {
  it("lists concentrations offered in a given size", () => {
    expect(availableConcentrations(shelf, 50)).toEqual(["eau_de_parfum", "extrait"]);
    expect(availableConcentrations(shelf, 100)).toEqual(["eau_de_parfum"]);
  });
});

describe("resolveVariant", () => {
  it("returns the exact variant for a size and concentration", () => {
    expect(resolveVariant(shelf, 100, "eau_de_parfum")?.id).toBe("100-edp");
  });

  it("returns null when that combination is not sold", () => {
    expect(resolveVariant(shelf, 100, "extrait")).toBeNull();
  });

  it("reports an out-of-stock variant as unavailable for purchase", () => {
    const selected = resolveVariant(shelf, 50, "extrait");
    expect(selected?.stock).toBe(0);
  });
});
