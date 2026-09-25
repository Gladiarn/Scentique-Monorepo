import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { collectionFixtures } from "./collections";
import { productFixtures } from "./products";

const pub = path.join(process.cwd(), "public");
const exists = (src: string) => existsSync(path.join(pub, src.replace(/^\//, "")));

const allMedia = [
  ...productFixtures.flatMap((p) => p.media.map((m) => ({ owner: p.slug, ...m }))),
  ...collectionFixtures.map((c) => ({ owner: `collection:${c.slug}`, ...c.media })),
];
const cardMedia = allMedia.filter((m) => m.role !== "hero");

describe("fixture images", () => {
  it("every image file the data points at exists on disk", () => {
    const missing = allMedia.filter((m) => m.src && !exists(m.src)).map((m) => `${m.owner}: ${m.src}`);
    expect(missing).toEqual([]);
  });

  it("cards show real photographs: no traced SVGs and nothing from the Original folder", () => {
    const bad = cardMedia.filter((m) => m.src && (/\.svg$/i.test(m.src) || /original/i.test(m.src))).map((m) => `${m.owner}: ${m.src}`);
    expect(bad).toEqual([]);
  });

  it("includes the newly supplied perfumes", () => {
    const slugs = productFixtures.map((p) => p.slug);
    for (const slug of ["nocturne-absolu", "mystique-bois", "l-ambre-sauvage", "l-ambre-eternel"]) expect(slugs).toContain(slug);
  });

  it("the first four scents, which fill Best sellers, all have a real photo", () => {
    for (const p of productFixtures.slice(0, 4)) {
      const photo = p.media.find((m) => m.role !== "hero");
      expect(photo?.src, p.slug).toMatch(/\.(webp|jpe?g|png)$/i);
    }
  });

  it("Bois Fumé Précieux keeps both of its photos for the product gallery", () => {
    const bois = productFixtures.find((p) => p.slug === "bois-fume-precieux");
    expect(bois?.media.filter((m) => m.role === "photo").length).toBeGreaterThanOrEqual(2);
  });
});
