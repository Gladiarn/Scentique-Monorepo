import { productRepository } from "@/data";
import { buildHeroSlides } from "../hero-slides";
import { HeroSlider } from "../hero-slider";

export async function HeroSection() {
  const featured = await productRepository.findFeatured();
  return <HeroSlider slides={buildHeroSlides(featured)} backdrop="/images/hero/silk-backdrop.webp" />;
}
