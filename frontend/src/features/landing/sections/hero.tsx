import { productRepository } from "@/data";
import { formatConcentration } from "@/lib/format";
import { heroMedia } from "@/lib/media";
import { HeroSlider, type HeroSlide } from "../hero-slider";

const CONCENTRATION_RANK = { eau_de_toilette: 0, eau_de_parfum: 1, extrait: 2 } as const;

export async function HeroSection() {
  const featured = await productRepository.findFeatured();

  const slides: HeroSlide[] = featured.flatMap((p) => {
    const image = heroMedia(p);
    if (!image) return [];
    const richest = [...p.variants].sort((a, b) => CONCENTRATION_RANK[b.concentration] - CONCENTRATION_RANK[a.concentration])[0];
    return [
      {
        id: p.id,
        slug: p.slug,
        name: p.name,
        concentration: richest ? formatConcentration(richest.concentration) : "",
        tagline: p.tagline,
        family: p.family,
        priceFromCents: Math.min(...p.variants.map((v) => v.priceCents)),
        image: { src: image.src, alt: image.alt, objectPosition: image.objectPosition, backdrop: image.backdrop },
      },
    ];
  });

  return <HeroSlider slides={slides} />;
}
