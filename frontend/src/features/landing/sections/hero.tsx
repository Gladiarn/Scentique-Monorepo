import { productRepository } from "@/data";
import { buildHeroContent } from "../hero-content";
import { Hero } from "../hero";

export async function HeroSection() {
  const chosen = await productRepository.findHeroFeatured();
  // Never render an empty hero: fall back to the first featured scent if none is flagged.
  const product = chosen ?? (await productRepository.findFeatured())[0];
  return <Hero content={buildHeroContent(product)} />;
}
