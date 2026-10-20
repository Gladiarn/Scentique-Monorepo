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
      <Seam shape="tide" flip />
      <BestSellers />
      <Seam shape="ridge" tone="glow" />
      <QuizSection products={products} />
      <Seam shape="shore" flip />
      <Reviews />
      <Seam shape="roll" tone="glow" />
      <Close />
    </>
  );
}
