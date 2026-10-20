import { About } from "@/features/landing/about";
import { BestSellers } from "@/features/landing/best-sellers";
import { Close } from "@/features/landing/close";
import { productRepository } from "@/data";
import { Hero } from "@/features/landing/hero";
import { QuizSection } from "@/features/landing/quiz-section";
import { Reviews } from "@/features/landing/reviews";

export default async function HomePage() {
  const products = await productRepository.findAll();
  return (
    <>
      <Hero />
      <About />
      <BestSellers />
      <QuizSection products={products} />
      <Reviews />
      <Close />
    </>
  );
}
