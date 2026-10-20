import { About } from "@/features/landing/about";
import { BestSellers } from "@/features/landing/best-sellers";
import { Close } from "@/features/landing/close";
import { Hero } from "@/features/landing/hero";
import { Reviews } from "@/features/landing/reviews";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <BestSellers />
      <Reviews />
      <Close />
    </>
  );
}
