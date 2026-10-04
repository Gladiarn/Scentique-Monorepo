import { describe, expect, it } from "vitest";
import type { Product } from "@scentique/shared";
import { productFixtures } from "@/data/mock/fixtures/products";
import { QUESTIONS, parseAnswers, recommend, scoreProduct } from "./quiz-logic";

const byFamily = (family: Product["family"]) => productFixtures.filter((p) => p.family === family);

describe("recommend", () => {
  it("returns two or three scents for every combination of answers", () => {
    for (const notes of QUESTIONS[0].options) {
      for (const occasion of QUESTIONS[1].options) {
        for (const audience of QUESTIONS[2].options) {
          for (const strength of QUESTIONS[3].options) {
            const picks = recommend({ notes: notes.value, occasion: occasion.value, for: audience.value, strength: strength.value }, productFixtures);
            expect(picks.length).toBeGreaterThanOrEqual(2);
            expect(picks.length).toBeLessThanOrEqual(3);
          }
        }
      }
    }
  });

  it("leads with the chosen note family", () => {
    const [first] = recommend({ notes: "oud" }, productFixtures);
    expect(first.family).toBe("oud");
  });

  it("ranks a matching concentration above one that is not sold", () => {
    const oud = byFamily("oud");
    const extrait = oud.filter((p) => p.variants.some((v) => v.concentration === "extrait"));
    if (extrait.length && extrait.length < oud.length) {
      const scores = oud.map((p) => scoreProduct(p, { notes: "oud", strength: "intense" }));
      const hasExtrait = oud.map((p) => extrait.includes(p));
      expect(Math.max(...scores.filter((_, i) => hasExtrait[i]))).toBeGreaterThan(Math.min(...scores.filter((_, i) => !hasExtrait[i])));
    }
  });

  it("still returns results when nothing fits the answers", () => {
    const picks = recommend({}, productFixtures);
    expect(picks.length).toBeGreaterThanOrEqual(2);
  });

  it("never returns the same scent twice", () => {
    const picks = recommend({ notes: "woody", occasion: "evening", for: "masculine", strength: "intense" }, productFixtures);
    expect(new Set(picks.map((p) => p.id)).size).toBe(picks.length);
  });
});

describe("parseAnswers", () => {
  it("keeps only known values from the URL", () => {
    expect(parseAnswers({ notes: "oud", occasion: "brunch", for: ["unisex", "x"], strength: "intense" })).toEqual({
      notes: "oud",
      strength: "intense",
      for: "unisex",
    });
  });
});
