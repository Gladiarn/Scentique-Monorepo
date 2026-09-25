import { Suspense } from "react";
import { SectionBoundary } from "@/features/landing/section-boundary";
import { SectionSkeleton } from "@/features/landing/section-skeleton";
import { BestSellersSection } from "@/features/landing/sections/best-sellers";
import { ClosingSection } from "@/features/landing/sections/closing";
import { CollectionsSection } from "@/features/landing/sections/collections";
import { HeroSection } from "@/features/landing/sections/hero";
import { StorySection } from "@/features/landing/sections/story";
import { TestimonialsSection } from "@/features/landing/sections/testimonials";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<SectionSkeleton className="min-h-[70svh]" />}>
        <HeroSection />
      </Suspense>
      <StorySection />
      <SectionBoundary label="the collections">
        <Suspense fallback={<SectionSkeleton className="min-h-[40rem]" />}>
          <CollectionsSection />
        </Suspense>
      </SectionBoundary>
      <SectionBoundary label="best sellers">
        <Suspense fallback={<SectionSkeleton className="min-h-[36rem]" />}>
          <BestSellersSection />
        </Suspense>
      </SectionBoundary>
      <SectionBoundary label="reviews">
        <Suspense fallback={<SectionSkeleton className="min-h-[20rem]" />}>
          <TestimonialsSection />
        </Suspense>
      </SectionBoundary>
      <ClosingSection />
    </>
  );
}
