import type { MediaAsset, Product } from "@scentique/shared";
import { describe, expect, it } from "vitest";
import { buildHeroContent } from "./hero-content";

const media = (alt: string, role?: MediaAsset["role"]): MediaAsset => ({ alt, promptBrief: "x".repeat(30), src: `/${alt}.webp`, role });
const product = (...m: MediaAsset[]): Product =>
  ({
    id: "p", slug: "p", name: "P", tagline: "t", family: "woody",
    variants: [
      { id: "a", sku: "a", sizeMl: 30, concentration: "eau_de_parfum", priceCents: 9200, stock: 5 },
      { id: "b", sku: "b", sizeMl: 50, concentration: "extrait", priceCents: 13200, stock: 5 },
    ],
    media: m,
  }) as unknown as Product;

describe("buildHeroContent", () => {
  it("uses the hero artwork for the background and the real photo for the card thumbnail", () => {
    const content = buildHeroContent(product(media("photo", "photo"), media("art", "hero")));
    expect(content?.image.alt).toBe("art");
    expect(content?.photo?.alt).toBe("photo");
  });

  it("falls back to the photo when there is no artwork, so the hero is never empty", () => {
    const content = buildHeroContent(product(media("photo", "photo")));
    expect(content?.image.alt).toBe("photo");
  });

  it("returns null for a product with no images", () => {
    expect(buildHeroContent(product())).toBeNull();
    expect(buildHeroContent(undefined)).toBeNull();
  });

  it("names the richest concentration and the lowest price", () => {
    const content = buildHeroContent(product(media("art", "hero")));
    expect(content?.concentration).toBe("Extrait de Parfum");
    expect(content?.priceFromCents).toBe(9200);
  });

  it("shows the second photo in the card when there is one, so it does not repeat the main image", () => {
    const content = buildHeroContent(product(media("main", "photo"), media("art", "hero"), media("second", "photo")));
    expect(content?.photo?.alt).toBe("second");
    expect(content?.image.alt).toBe("art");
  });

  it("uses the only photo when there is just one", () => {
    expect(buildHeroContent(product(media("only", "photo"), media("art", "hero")))?.photo?.alt).toBe("only");
  });
});
