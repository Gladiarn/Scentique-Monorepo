import type { Product } from "@scentique/shared";
import { formatConcentration } from "@/lib/format";
import { heroArt, photoMedia } from "@/lib/media";
import type { HeroSlide } from "./hero-slider";

const CONCENTRATION_RANK = { eau_de_toilette: 0, eau_de_parfum: 1, extrait: 2 } as const;

function toSlide(product: Product, image: NonNullable<ReturnType<typeof photoMedia>>): HeroSlide {
  const richest = [...product.variants].sort((a, b) => CONCENTRATION_RANK[b.concentration] - CONCENTRATION_RANK[a.concentration])[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    concentration: richest ? formatConcentration(richest.concentration) : "",
    tagline: product.tagline,
    family: product.family,
    priceFromCents: Math.min(...product.variants.map((v) => v.priceCents)),
    image: { src: image.src, alt: image.alt, objectPosition: image.objectPosition, objectPositionDesktop: image.objectPositionDesktop },
  };
}

/** Hero slides come from products with hero artwork. If none have it, fall back to their photos so the hero is never empty. */
export function buildHeroSlides(products: Product[]): HeroSlide[] {
  const art = products.flatMap((p) => {
    const image = heroArt(p);
    return image ? [toSlide(p, image)] : [];
  });
  if (art.length > 0) return art;
  return products.flatMap((p) => {
    const image = photoMedia(p);
    return image ? [toSlide(p, image)] : [];
  });
}
