import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { photoMedia } from "@/lib/media";
import { MockProductRepository } from "../product";

const pub = path.join(process.cwd(), "public");
const md5 = (file: string) => createHash("md5").update(readFileSync(path.join(pub, file))).digest("hex");
const repo = new MockProductRepository({ latencyMs: 0 });

const CASES = [
  { slug: "l-ambre-sauvage", card: "images/products/l-ambre-sauvage.svg", original: "perfumes/Original/LAMBRE-SAUVAGE.svg" },
  { slug: "l-ambre-eternel", card: "images/products/l-ambre-eternel.svg", original: "perfumes/Original/L'AMBRE ÉTERNEL.svg" },
];

describe("cards use the supplied original art for L'Ambre Sauvage and L'Ambre Éternel", () => {
  it.each(CASES)("$slug: the card image is the original, byte for byte", ({ card, original }) => {
    expect(md5(card)).toBe(md5(original));
  });

  it.each(CASES)("$slug: shop and card image points at that untouched copy", async ({ slug, card }) => {
    const product = await repo.findBySlug(slug);
    const media = photoMedia(product!);
    expect(media?.src).toBe(`/${card}`);
    expect(media?.backdrop).toBeUndefined();
  });

  it("the collections floral card uses the original Sauvage art too", async () => {
    const { collectionFixtures } = await import("./collections");
    const floral = collectionFixtures.find((c) => c.family === "floral");
    expect(floral?.media.src).toBe("/images/products/l-ambre-sauvage.svg");
    expect(floral?.media.backdrop).toBeUndefined();
  });
});
