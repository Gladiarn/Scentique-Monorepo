import type { MediaAsset, Notes, Product, ScentFamily } from "@scentique/shared";
import { formatConcentration } from "@/lib/format";
import { heroArt, photoMedia } from "@/lib/media";

const isPhoto = (m: MediaAsset) => m.role !== "hero";

const CONCENTRATION_RANK = { eau_de_toilette: 0, eau_de_parfum: 1, extrait: 2 } as const;

export interface HeroContent {
  slug: string;
  name: string;
  concentration: string;
  tagline: string;
  family: ScentFamily;
  notes: Notes;
  priceFromCents: number;
  /** Full-bleed background art. */
  image: Pick<MediaAsset, "src" | "alt" | "objectPosition" | "objectPositionDesktop">;
  /** Real photograph for the card thumbnail. */
  photo?: Pick<MediaAsset, "src" | "alt" | "objectPosition">;
}

/** Content for the landing hero from one product. Falls back to its photo when it has no hero artwork; null when it has no images at all. */
export function buildHeroContent(product: Product | null | undefined): HeroContent | null {
  if (!product) return null;
  const photos = product.media.filter(isPhoto);
  const main = photoMedia(product);
  const image = heroArt(product) ?? main;
  if (!image) return null;
  // The card shows the second photo when there is one, so it does not repeat the image behind it.
  const photo = photos[1] ?? photos[0] ?? main;

  const richest = [...product.variants].sort((a, b) => CONCENTRATION_RANK[b.concentration] - CONCENTRATION_RANK[a.concentration])[0];
  return {
    slug: product.slug,
    name: product.name,
    concentration: richest ? formatConcentration(richest.concentration) : "",
    tagline: product.tagline,
    family: product.family,
    notes: product.notes,
    priceFromCents: Math.min(...product.variants.map((v) => v.priceCents)),
    image: { src: image.src, alt: image.alt, objectPosition: image.objectPosition, objectPositionDesktop: image.objectPositionDesktop },
    photo: photo ? { src: photo.src, alt: photo.alt, objectPosition: photo.objectPosition } : undefined,
  };
}
