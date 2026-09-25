import { describe, expect, it } from "vitest";
import { MockProductRepository } from "./product";

const repo = new MockProductRepository({ latencyMs: 0 });

describe("MockProductRepository", () => {
  it("findFeatured returns only featured products", async () => {
    const featured = await repo.findFeatured();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it("findBySlug resolves null for an unknown slug", async () => {
    await expect(repo.findBySlug("does-not-exist")).resolves.toBeNull();
  });

  it("findAll filters by scent family", async () => {
    const oud = await repo.findAll({ family: "oud" });
    expect(oud.length).toBeGreaterThan(0);
    expect(oud.every((p) => p.family === "oud")).toBe(true);
  });

  it("returns a promise, not synchronous data", () => {
    expect(repo.findAll()).toBeInstanceOf(Promise);
  });

  it("every product has at least one variant and a prompt brief per image", async () => {
    for (const p of await repo.findAll()) {
      expect(p.variants.length).toBeGreaterThan(0);
      expect(p.media.every((m) => m.promptBrief.length > 20)).toBe(true);
    }
  });
});

describe("featured scents for the landing slider", () => {
  it("has at least four featured scents, each with a real hero image", async () => {
    const featured = await repo.findFeatured();
    expect(featured.length).toBeGreaterThanOrEqual(4);
    expect(featured.every((p) => Boolean(p.media[0]?.src))).toBe(true);
  });
});

describe("findBestSellers (static ranking until the backend has sales data)", () => {
  it("returns the ranked scents in order, up to the limit", async () => {
    const top = await repo.findBestSellers(4);
    expect(top.map((p) => p.slug)).toEqual(["ambre-fume", "bois-fume-precieux", "nocturne-absolu", "mystique-bois"]);
  });

  it("respects a smaller limit", async () => {
    expect(await repo.findBestSellers(2)).toHaveLength(2);
  });

  it("returns at most the limit and never an undefined entry", async () => {
    const many = await repo.findBestSellers(50);
    expect(many.length).toBeLessThanOrEqual(50);
    expect(many.every(Boolean)).toBe(true);
  });
});

describe("findHeroFeatured (the one item featured in the landing hero)", () => {
  it("returns the featured scent: Bois Fumé Précieux", async () => {
    const product = await repo.findHeroFeatured();
    expect(product?.slug).toBe("bois-fume-precieux");
  });
  it("that scent has more than one photo, so the card can differ from the background", async () => {
    const product = await repo.findHeroFeatured();
    expect(product?.media.filter((m) => m.role !== "hero").length).toBeGreaterThanOrEqual(2);
  });
});
