/* SYNTHETIC placeholder content. */
import type { Collection } from "@scentique/shared";

const STYLE = "Dark warm luxury still life, soft directional light, subtle film grain, generous negative space, no text.";

export const collectionFixtures: Collection[] = [
  {
    id: "woody", slug: "woody", name: "Woody", family: "woody",
    blurb: "Cedar, vetiver and smoke. Warm, dry and grounded.",
    media: { src: "/images/hero/bois-fume-precieux.webp", objectPosition: "64% 50%", alt: "Bois Fumé Précieux perfume bottle among frankincense and bark", promptBrief: `A smoked-glass perfume bottle on a raw cedar plank with wood shavings. ${STYLE}` },
  },
  {
    id: "floral", slug: "floral", name: "Floral", family: "floral",
    blurb: "Iris, rose and jasmine, cool at first and then warm.",
    media: { src: "/images/products/l-ambre-sauvage.svg", objectPosition: "61% 50%", alt: "L'Ambre Sauvage perfume bottle among jasmine flowers", promptBrief: `A blush-tinted perfume bottle beside dark roses and iris on velvet. ${STYLE}` },
  },
  {
    id: "citrus", slug: "citrus", name: "Citrus", family: "citrus",
    blurb: "Bright peel and blossom over a clean musk.",
    media: { alt: "Citrus collection bottle beside fruit", promptBrief: `A clear perfume bottle with halved blood orange and green leaves on dark slate. ${STYLE}` },
  },
  {
    id: "oud", slug: "oud", name: "Oud", family: "oud",
    blurb: "Aged resin, amber and saffron. Deep and slow.",
    media: { src: "/images/hero/ambre-fume.webp", objectPosition: "64% 50%", alt: "Ambre Fumé perfume bottle among amber resin and cinnamon", promptBrief: `A dark amber perfume bottle beside chunks of oud wood and resin on black stone. ${STYLE}` },
  },
];
