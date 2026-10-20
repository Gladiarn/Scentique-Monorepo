import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { productRepository } from "@/data";
import { DevelopmentRail } from "./development-rail";
import { Embers } from "./embers";
import { PeakCta } from "./peak-cta";
import { ScrollVars } from "./scroll-vars";
import { ScrubVideo } from "./scrub-video";

const FAMILIES = ["floral", "woody", "citrus", "oud"] as const;

const chip =
  "inline-flex h-11 items-center gap-2.5 rounded-pill border border-ink/20 bg-surface/35 px-5 text-sm capitalize text-ink/90 backdrop-blur-glass press hover:border-accent hover:text-ink";

/**
 * The first act and the peak of the page: a clip you scrub with the wheel, in planes. Behind: the clip (camera depth).
 * Between: the headline, which moves slower than the scroll and clears before the peak. In front: embers rising faster
 * than the scroll. Beside it: the featured scent's notes developing, top to base. At the peak, one call to action.
 */
export async function Hero() {
  const product = (await productRepository.findHeroFeatured()) ?? (await productRepository.findFeatured())[0] ?? null;

  return (
    <section id="top" aria-label="Featured scent" data-scrub-section="" className="relative h-[280svh]">
      <ScrollVars />
      <div className="sticky top-0 h-svh overflow-hidden bg-page">
        <ScrubVideo
          src="/media/hero.mp4"
          srcMobile="/media/hero-m.mp4"
          poster="/media/hero-poster.webp"
          posterMobile="/media/hero-m-poster.webp"
          label="Bois Fumé Précieux perfume bottle on a stone plinth, lit by warm amber light with drifting smoke"
        />
        {/* A scrim only where the copy sits: the bottom on phones, the left on wide screens. */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page/90 via-page/20 to-transparent md:bg-gradient-to-r md:from-page/85 md:via-page/25 md:to-transparent" />
        {/* Leaving: the bottom of the frame dissolves into the page colour, so the video never ends on a hard edge. */}
        <div
          data-plane="exit"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-transparent via-page/70 to-page"
          style={{ opacity: "clamp(0, calc(var(--x, 0) * 3), 1)" }}
        />
        <Embers />

        <Container className="relative flex h-full items-end pb-14 md:items-center md:pb-0">
          <div
            data-plane="type"
            className="max-w-2xl will-change-transform"
            style={{ transform: "translate3d(0, calc(var(--p, 0) * -14vh), 0)", opacity: "max(0, calc(1 - var(--p, 0) * 2))" }}
          >
            <h1 className="font-display text-[clamp(2.5rem,1.3rem+3.6vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-balance">
              Made in small batches from <Em>rare ingredients</Em>
            </h1>
            <p className="mt-6 hidden max-w-md text-lg text-ink/80 md:block">
              Four scent families, blended by hand in twelve-litre lots and rested for six weeks before they are bottled.
            </p>
            <Button href="/shop" className="mt-7 md:mt-9">
              Discover collection
            </Button>
            <ul aria-label="Browse by scent family" className="mt-8 hidden flex-wrap gap-2.5 md:flex">
              {FAMILIES.map((family) => (
                <li key={family}>
                  <Link href={`/shop?family=${family}`} className={chip}>
                    <span aria-hidden="true" className="size-1.5 rounded-pill" style={{ background: `var(--color-${family})` }} />
                    {family}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>

        {product && (
          <>
            <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 md:block lg:right-10">
              <DevelopmentRail notes={product.notes} />
            </div>
            <Container data-plane="peak" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-14 md:justify-start md:pb-16">
              <div className="pointer-events-auto">
                <PeakCta href={`/product/${product.slug}`}>Shop {product.name}</PeakCta>
              </div>
            </Container>
          </>
        )}
      </div>
    </section>
  );
}
