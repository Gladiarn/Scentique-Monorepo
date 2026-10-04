import type { Concentration, Gender, Product, ScentFamily } from "@scentique/shared";

export type Notes = ScentFamily;
export type Occasion = "day" | "evening" | "anytime";
export type Strength = "light" | "balanced" | "intense";
export type Audience = Gender;

export interface QuizAnswers {
  notes?: Notes;
  occasion?: Occasion;
  for?: Audience;
  strength?: Strength;
}

export interface QuizQuestion<K extends keyof QuizAnswers = keyof QuizAnswers> {
  key: K;
  prompt: string;
  options: { value: NonNullable<QuizAnswers[K]>; label: string; hint: string }[];
}

export const QUESTIONS: [
  QuizQuestion<"notes">,
  QuizQuestion<"occasion">,
  QuizQuestion<"for">,
  QuizQuestion<"strength">,
] = [
  {
    key: "notes",
    prompt: "Which notes do you reach for?",
    options: [
      { value: "woody", label: "Woody", hint: "Cedar, vetiver, dry wood" },
      { value: "floral", label: "Floral", hint: "Rose, iris, soft petals" },
      { value: "citrus", label: "Citrus", hint: "Bright peel, fresh air" },
      { value: "oud", label: "Oud", hint: "Resin, smoke, depth" },
    ],
  },
  {
    key: "occasion",
    prompt: "When will you wear it most?",
    options: [
      { value: "day", label: "Daytime", hint: "Work, errands, long walks" },
      { value: "evening", label: "Evening", hint: "Dinner, nights out" },
      { value: "anytime", label: "Anytime", hint: "No particular rule" },
    ],
  },
  {
    key: "for",
    prompt: "Who is it for?",
    options: [
      { value: "feminine", label: "Feminine", hint: "A softer, rounder cut" },
      { value: "masculine", label: "Masculine", hint: "A drier, sharper cut" },
      { value: "unisex", label: "Unisex", hint: "Happy either way" },
    ],
  },
  {
    key: "strength",
    prompt: "How strong should it be?",
    options: [
      { value: "light", label: "Light", hint: "Close to the skin" },
      { value: "balanced", label: "Balanced", hint: "Noticed, not overwhelming" },
      { value: "intense", label: "Intense", hint: "Felt across the room" },
    ],
  },
];

const FAMILY_BY_OCCASION: Record<Occasion, Partial<Record<ScentFamily, number>>> = {
  day: { citrus: 2, floral: 1 },
  evening: { oud: 2, woody: 2 },
  anytime: {},
};

const CONCENTRATION_BY_STRENGTH: Record<Strength, Concentration> = {
  light: "eau_de_toilette",
  balanced: "eau_de_parfum",
  intense: "extrait",
};

/** How well one product fits the answers. Higher is better; 0 means no fit at all. */
export function scoreProduct(product: Product, answers: QuizAnswers): number {
  let score = 0;
  if (answers.notes === product.family) score += 3;
  if (answers.occasion) score += FAMILY_BY_OCCASION[answers.occasion][product.family] ?? 0;
  if (answers.for) {
    if (product.gender === answers.for) score += 2;
    else if (product.gender === "unisex") score += 1;
  }
  if (answers.strength) {
    const wanted = CONCENTRATION_BY_STRENGTH[answers.strength];
    if (product.variants.some((v) => v.concentration === wanted)) score += 2;
  }
  return score;
}

const MIN_RESULTS = 2;
const MAX_RESULTS = 3;

/**
 * Two or three scents for any answers. Ranks by fit, then by featured. If fewer than two scents
 * fit at all, the list is topped up with the best of the rest, so a result is always shown.
 */
export function recommend(answers: QuizAnswers, products: Product[]): Product[] {
  const ranked = products
    .map((product) => ({ product, score: scoreProduct(product, answers) }))
    .sort((a, b) => b.score - a.score || Number(b.product.featured) - Number(a.product.featured));
  const fitting = ranked.filter((r) => r.score > 0).map((r) => r.product);
  const picks = fitting.length >= MIN_RESULTS ? fitting : ranked.map((r) => r.product);
  return picks.slice(0, Math.min(MAX_RESULTS, Math.max(MIN_RESULTS, picks.length)));
}

/** Reads answers from the URL. Only known values survive, so a hand-edited link cannot break the quiz. */
export function parseAnswers(params: Record<string, string | string[] | undefined>): QuizAnswers {
  const pick = <T extends string>(key: string, allowed: readonly T[]): T | undefined => {
    const raw = Array.isArray(params[key]) ? params[key][0] : params[key];
    return allowed.find((a) => a === raw);
  };
  return {
    notes: pick("notes", ["woody", "floral", "citrus", "oud"] as const),
    occasion: pick("occasion", ["day", "evening", "anytime"] as const),
    for: pick("for", ["feminine", "masculine", "unisex"] as const),
    strength: pick("strength", ["light", "balanced", "intense"] as const),
  };
}
