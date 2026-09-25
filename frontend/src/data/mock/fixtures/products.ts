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

const HERO_POSITION = "64% 50%";
const SILK = "/images/hero/silk-backdrop.webp";

export const productFixtures: Product[] = [
  {
    id: "ambre-fume", slug: "ambre-fume", name: "Ambre Fumé", featured: true, family: "oud", gender: "unisex",
    tagline: "Smoked amber, cinnamon bark and vanilla pod.",
    description: "A warm smoulder of amber resin and cinnamon, softened by vanilla and dried leaves.",
    notes: { top: ["Star anise", "Cinnamon"], heart: ["Dried leaves", "Tobacco flower"], base: ["Amber resin", "Vanilla pod"] },
    variants: variants("ambre-fume", 8800),
    media: [{ src: "/images/hero/ambre-fume.webp", alt: "Ambre Fumé perfume bottle on a stone plinth among amber, vanilla and cinnamon", objectPosition: HERO_POSITION,
      promptBrief: "Faceted amber-glass flacon with a gold spray collar on a rough stone plinth, amber resin, vanilla pods and cinnamon sticks around it, dark silk behind. Dark warm luxury still life, soft directional amber light, film grain, 16:9." }],
    createdAt: "2026-03-02",
  },
  {
    id: "bois-fume-precieux", slug: "bois-fume-precieux", name: "Bois Fumé Précieux", featured: true, family: "woody", gender: "unisex",
    tagline: "Frankincense, cinnamon bark and smoked woods.",
    description: "Precious woods and frankincense resin wrapped in a thread of smoke.",
    notes: { top: ["Cinnamon bark", "Pink pepper"], heart: ["Frankincense", "Dried leaves"], base: ["Smoked woods", "Amber"] },
    variants: variants("bois-fume-precieux", 9200),
    media: [{ src: "/images/hero/bois-fume-precieux.webp", alt: "Bois Fumé Précieux perfume bottle on a stone plinth with frankincense and bark", objectPosition: HERO_POSITION,
      promptBrief: "Rounded teardrop glass flacon with a faceted smoky-amber stopper on a rough stone plinth, frankincense resin and curled cinnamon bark around it, dark silk behind. Dark warm luxury still life, film grain, 16:9." }],
    createdAt: "2026-04-11",
  },
  {
    id: "l-ambre-sauvage", slug: "l-ambre-sauvage", name: "L'Ambre Sauvage", featured: true, family: "floral", gender: "unisex",
    tagline: "Wild jasmine, roasted coffee and dry cedar.",
    description: "Jasmine and coffee over an amber base, a little wild and a little dark.",
    notes: { top: ["Coffee bean"], heart: ["Jasmine sambac", "Green leaves"], base: ["Amber", "Dry cedar"] },
    variants: variants("l-ambre-sauvage", 9000),
    media: [{ src: "/images/hero/l-ambre-sauvage.svg", backdrop: SILK, role: "hero", alt: "L'Ambre Sauvage perfume bottle with jasmine flowers and coffee beans", objectPosition: "67% 50%", objectPositionDesktop: "75% 50%",
      promptBrief: "Faceted clear-glass flacon with a gold spray collar on a rough stone plinth, jasmine flowers and roasted coffee beans around it, deep black background. Dark warm luxury still life, film grain, 16:9. (Supplied as a traced SVG; replace with the original photo.)" }],
    createdAt: "2026-06-03",
  },
  {
    id: "l-ambre-eternel", slug: "l-ambre-eternel", name: "L'Ambre Éternel", featured: true, family: "oud", gender: "unisex",
    tagline: "Star anise, cardamom and cedar shavings on amber.",
    description: "An amber that keeps going: spiced at first, then resinous and quietly woody.",
    notes: { top: ["Star anise", "Cardamom"], heart: ["Cinnamon", "Clove"], base: ["Amber", "Cedar shavings"] },
    variants: variants("l-ambre-eternel", 9600),
    media: [{ src: "/images/hero/l-ambre-eternel.svg", backdrop: SILK, role: "hero", alt: "L'Ambre Éternel perfume bottle on a stone plinth with star anise and cinnamon", objectPosition: "56% 50%", objectPositionDesktop: "8% 50%",
      promptBrief: "Faceted golden-amber glass flacon on a rough stone plinth with star anise, cinnamon sticks and cedar shavings, deep black background. Dark warm luxury still life, film grain, 16:9. (Supplied as a traced SVG; replace with the original photo.)" }],
    createdAt: "2026-05-20",
  },
  {
    id: "bitter-orange-hour", slug: "bitter-orange-hour", name: "Bitter Orange Hour", featured: false, family: "citrus", gender: "unisex",
    tagline: "Blood orange, neroli and a clean white musk.",
    description: "Bright peel and neroli blossom over a soft musk that lingers.",
    notes: { top: ["Bergamot", "Blood orange"], heart: ["Neroli", "Petitgrain"], base: ["White musk"] },
    variants: variants("bitter-orange-hour", 7400),
    media: [bottle("Bitter Orange Hour", "citrus", "a tall clear-glass bottle with a pale gold liquid, a halved blood orange and green leaves beside it.")],
    createdAt: "2026-04-11",
  },
  {
    id: "night-iris", slug: "night-iris", name: "Night Iris", featured: false, family: "floral", gender: "feminine",
    tagline: "Powdery iris, violet leaf and warm tonka.",
    description: "A cool, powdery iris that warms into tonka and vanilla.",
    notes: { top: ["Violet leaf", "Mandarin"], heart: ["Orris", "Iris"], base: ["Tonka bean", "Vanilla"] },
    variants: variants("night-iris", 9200),
    media: [bottle("Night Iris", "floral", "a rounded blush-tinted bottle beside a deep purple-white iris stem on dark velvet.")],
    createdAt: "2026-02-18",
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
];
