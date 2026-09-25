import { siteConfig } from "@/config/site";
import { productRepository } from "@/data";
import { buildHeroContent } from "../hero-content";
import { Hero } from "../hero";

export async function HeroSection() {
  const chosen = await productRepository.findBySlug(siteConfig.heroProductSlug);
  // Never render an empty hero: fall back to the first featured scent if the chosen one is missing.
  const product = chosen ?? (await productRepository.findFeatured())[0];
  return <Hero content={buildHeroContent(product)} />;
}
