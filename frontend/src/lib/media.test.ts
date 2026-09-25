import type { MediaAsset, Product } from "@scentique/shared";
import { describe, expect, it } from "vitest";
import { heroMedia, photoMedia } from "./media";

const asset = (alt: string, role?: MediaAsset["role"]): MediaAsset => ({ alt, promptBrief: "x".repeat(30), src: `/${alt}.webp`, role });
const product = (...media: MediaAsset[]) => ({ media }) as Pick<Product, "media">;

describe("heroMedia", () => {
  it("prefers an image tagged as hero artwork", () => {
    expect(heroMedia(product(asset("photo", "photo"), asset("art", "hero")))?.alt).toBe("art");
  });
  it("falls back to the first image when nothing is tagged hero", () => {
    expect(heroMedia(product(asset("photo", "photo")))?.alt).toBe("photo");
  });
  it("returns undefined for a product with no images", () => {
    expect(heroMedia(product())).toBeUndefined();
  });
});

describe("photoMedia", () => {
  it("prefers a real photo over hero artwork, so shop pages show the photo", () => {
    expect(photoMedia(product(asset("art", "hero"), asset("photo", "photo")))?.alt).toBe("photo");
  });
  it("falls back to the first image when only hero artwork exists", () => {
    expect(photoMedia(product(asset("art", "hero")))?.alt).toBe("art");
  });
});
