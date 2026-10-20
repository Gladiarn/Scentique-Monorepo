import { About } from "@/features/landing/about";
import { BestSellers } from "@/features/landing/best-sellers";
import { Close } from "@/features/landing/close";
import { productRepository } from "@/data";
import { Hero } from "@/features/landing/hero";
import { QuizSection } from "@/features/landing/quiz-section";
import { Reviews } from "@/features/landing/reviews";
import { Seam } from "@/features/landing/seam";

export default async function HomePage() {
  const products = await productRepository.findAll();
  return (
    <>
      <Hero />
      <Seam shape="swell" />
      <About />
      <Seam shape="tide" tone="woody" flip />
      <BestSellers />
      <Seam shape="ridge" tone="floral" />
      <QuizSection products={products} />
      <Seam shape="shore" tone="glow" flip />
      <Reviews />
      <Seam shape="roll" tone="oud" />
      <Close />
    </>
  );
}
