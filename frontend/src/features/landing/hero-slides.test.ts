import type { MediaAsset, Product } from "@scentique/shared";
import { describe, expect, it } from "vitest";
import { buildHeroSlides } from "./hero-slides";

const media = (alt: string, role?: MediaAsset["role"]): MediaAsset => ({ alt, promptBrief: "x".repeat(30), src: `/${alt}.webp`, role });
const product = (id: string, ...m: MediaAsset[]): Product =>
  ({
    id, slug: id, name: id, tagline: "t", family: "oud", featured: true,
    variants: [{ id: "v", sku: "s", sizeMl: 50, concentration: "extrait", priceCents: 9000, stock: 5 }],
    media: m,
  }) as unknown as Product;

describe("buildHeroSlides", () => {
  it("uses only hero artwork when any product has it", () => {
    const slides = buildHeroSlides([product("a", media("photo-a", "photo")), product("b", media("art-b", "hero"))]);
    expect(slides.map((s) => s.id)).toEqual(["b"]);
  });

  it("falls back to product photos so the hero is never empty", () => {
    const slides = buildHeroSlides([product("a", media("photo-a", "photo")), product("b", media("photo-b"))]);
    expect(slides.map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("skips products with no images at all", () => {
    expect(buildHeroSlides([product("a")])).toEqual([]);
  });

  it("names the richest concentration and the lowest price", () => {
    const [slide] = buildHeroSlides([product("a", media("art", "hero"))]);
    expect(slide?.concentration).toBe("Extrait de Parfum");
    expect(slide?.priceFromCents).toBe(9000);
  });
});
