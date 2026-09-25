/* SYNTHETIC placeholder content. No real products, prices or claims. */
import type { MediaAsset, Product, ScentFamily, Variant } from "@scentique/shared";

const STYLE =
  "Dark warm luxury still life on a deep espresso-brown surface, soft directional amber light, subtle film grain, generous negative space, no text on the bottle.";

function bottle(name: string, family: ScentFamily, detail: string): MediaAsset {
  return {
    alt: `${name} perfume bottle`,
    promptBrief: `A ${family} fragrance bottle named ${name}: ${detail} ${STYLE}`,
  };
}

function variants(id: string, base: number, soldOut = false): Variant[] {
  return [
    { id: `${id}-30`, sku: `${id.toUpperCase()}-30EDP`, sizeMl: 30, concentration: "eau_de_parfum", priceCents: base, stock: soldOut ? 0 : 24 },
    { id: `${id}-50`, sku: `${id.toUpperCase()}-50EDP`, sizeMl: 50, concentration: "eau_de_parfum", priceCents: base + 4000, stock: soldOut ? 0 : 18 },
    { id: `${id}-50x`, sku: `${id.toUpperCase()}-50EXT`, sizeMl: 50, concentration: "extrait", priceCents: base + 7000, stock: soldOut ? 0 : 6 },
  ];
}

export const productFixtures: Product[] = [
  {
    id: "ember-oud", slug: "ember-oud", name: "Ember Oud", featured: true, family: "oud", gender: "unisex",
    tagline: "Smoked cedar, aged oud, a thread of saffron.",
    description: "A slow-burning oud softened by saffron and rose, resting on amber.",
    notes: { top: ["Saffron", "Pink pepper"], heart: ["Smoked cedar", "Damask rose"], base: ["Aged oud", "Amber"] },
    variants: variants("ember-oud", 8800),
    media: [bottle("Ember Oud", "oud", "a square amber-glass flacon with a heavy dark stopper, glowing from within, resting on a slab of dark stone with smoke curling behind.")],
    createdAt: "2026-03-02",
  },
  {
    id: "bitter-orange-hour", slug: "bitter-orange-hour", name: "Bitter Orange Hour", featured: true, family: "citrus", gender: "unisex",
    tagline: "Blood orange, neroli and a clean white musk.",
    description: "Bright peel and neroli blossom over a soft musk that lingers.",
    notes: { top: ["Bergamot", "Blood orange"], heart: ["Neroli", "Petitgrain"], base: ["White musk"] },
    variants: variants("bitter-orange-hour", 7400),
    media: [bottle("Bitter Orange Hour", "citrus", "a tall clear-glass bottle with a pale gold liquid, a halved blood orange and green leaves beside it.")],
    createdAt: "2026-04-11",
  },
  {
    id: "night-iris", slug: "night-iris", name: "Night Iris", featured: true, family: "floral", gender: "feminine",
    tagline: "Powdery iris, violet leaf and warm tonka.",
    description: "A cool, powdery iris that warms into tonka and vanilla.",
    notes: { top: ["Violet leaf", "Mandarin"], heart: ["Orris", "Iris"], base: ["Tonka bean", "Vanilla"] },
    variants: variants("night-iris", 9200),
    media: [bottle("Night Iris", "floral", "a rounded blush-tinted bottle beside a deep purple-white iris stem on dark velvet.")],
    createdAt: "2026-02-18",
  },
  {
    id: "cedar-room", slug: "cedar-room", name: "Cedar Room", featured: true, family: "woody", gender: "masculine",
    tagline: "Cardamom, Atlas cedar and dry vetiver.",
    description: "Sawn cedar and cardamom over a dry, earthy vetiver base.",
    notes: { top: ["Cardamom", "Juniper"], heart: ["Atlas cedar", "Cypress"], base: ["Vetiver", "Patchouli"] },
    variants: variants("cedar-room", 8400),
    media: [bottle("Cedar Room", "woody", "a rectangular smoked-glass bottle on a raw cedar plank with curled wood shavings.")],
    createdAt: "2026-01-09",
  },
  {
    id: "lemon-ash", slug: "lemon-ash", name: "Lemon Ash", featured: false, family: "citrus", gender: "unisex",
    tagline: "Sharp lemon over ash-grey incense.",
    description: "Sun-bright lemon peel dulled by cool incense smoke.",
    notes: { top: ["Lemon", "Yuzu"], heart: ["Incense", "Ginger"], base: ["Ambrette"] },
    variants: variants("lemon-ash", 7600, true),
    media: [bottle("Lemon Ash", "citrus", "a frosted-glass bottle with pale yellow liquid, a lemon peel curl and pale grey ash on a dark slate surface.")],
    createdAt: "2026-05-20",
  },
  {
    id: "petal-smoke", slug: "petal-smoke", name: "Petal Smoke", featured: false, family: "floral", gender: "unisex",
    tagline: "Rose and jasmine wrapped in birch tar.",
    description: "A dark rose that smoulders rather than sweetens.",
    notes: { top: ["Pink pepper"], heart: ["Turkish rose", "Jasmine"], base: ["Birch tar", "Musk"] },
    variants: variants("petal-smoke", 8800),
    media: [bottle("Petal Smoke", "floral", "a dusty-rose glass bottle with a few dark-red rose petals and thin smoke on an espresso surface.")],
    createdAt: "2026-06-03",
  },
  {
    id: "vetiver-rain", slug: "vetiver-rain", name: "Vetiver Rain", featured: false, family: "woody", gender: "unisex",
    tagline: "Wet earth, green vetiver, pale sandalwood.",
    description: "The smell of soil after rain, held on a soft sandalwood base.",
    notes: { top: ["Green tea"], heart: ["Vetiver", "Moss"], base: ["Sandalwood"] },
    variants: variants("vetiver-rain", 8000),
    media: [bottle("Vetiver Rain", "woody", "a slim green-tinted bottle with water droplets on dark stone and a sprig of vetiver root.")],
    createdAt: "2026-06-28",
  },
  {
    id: "amber-nocturne", slug: "amber-nocturne", name: "Amber Nocturne", featured: false, family: "oud", gender: "feminine",
    tagline: "Resinous amber, dark plum and soft oud.",
    description: "A warm resin blend with dark fruit and a whisper of oud.",
    notes: { top: ["Plum", "Cinnamon"], heart: ["Labdanum", "Benzoin"], base: ["Oud", "Amber"] },
    variants: variants("amber-nocturne", 9600),
    media: [bottle("Amber Nocturne", "oud", "a deep-red glass bottle with chunks of golden amber resin and a single plum on black stone.")],
    createdAt: "2026-07-15",
  },
];
