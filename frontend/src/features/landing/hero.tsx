import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { ScrubVideo } from "./scrub-video";

const FAMILIES = ["floral", "woody", "citrus", "oud"] as const;

const chip =
  "inline-flex h-11 items-center gap-2.5 rounded-pill border border-ink/25 bg-surface/45 px-5 text-xs uppercase tracking-[0.16em] text-ink/90 backdrop-blur-glass transition-colors hover:border-accent hover:text-ink";

/**
 * The first screen: a clip you scrub with the wheel. The section is tall; the clip and copy stay pinned to the viewport
 * while the scroll drives the camera push toward the bottle. The poster is the clip's own first frame.
 */
export function Hero() {
  return (
    <section id="top" aria-label="Featured scent" data-scrub-section="" className="relative h-[280svh]">
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
        <Container className="relative flex h-full items-end pb-14 md:items-center md:pb-0">
          <div className="max-w-2xl">
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
      </div>
    </section>
  );
}
