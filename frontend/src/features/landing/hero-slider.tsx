"use client";

import Link from "next/link";
import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { ProductImage } from "@/components/brand/product-image";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { ScentFamily } from "@scentique/shared";

export interface HeroSlide {
  id: string;
  slug: string;
  name: string;
  concentration: string;
  tagline: string;
  family: ScentFamily;
  priceFromCents: number;
  image: { src?: string; alt: string; objectPosition?: string; objectPositionDesktop?: string; featherEdges?: boolean };
}

/** Per-slide crop, so each painted bottle lands between the headline and the glass card at both sizes. */
function cropVars(image: HeroSlide["image"]): CSSProperties {
  return {
    "--pos-m": image.objectPosition,
    "--pos-d": image.objectPositionDesktop,
  } as CSSProperties;
}

const FAMILIES: ScentFamily[] = ["floral", "woody", "citrus", "oud"];
const SWIPE_PX = 50;

/* The art keeps its own dark background so the cap and shadows stay intact; its outer edges fade into the curtain. */
const ART_MASK = "radial-gradient(ellipse 44% 66% at 61% 50%, #000 34%, transparent 100%)";

const chip =
  "inline-flex h-11 items-center gap-2.5 rounded-pill border border-ink/25 bg-page/30 px-5 text-xs uppercase tracking-[0.16em] text-ink/90 backdrop-blur-sm transition-colors hover:border-accent hover:text-ink";

const arrowButton =
  "grid size-12 cursor-pointer place-items-center rounded-pill border border-ink/25 bg-page/35 text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent";

/** Full-bleed hero that steps through the featured scents with arrows, keys or swipe. No autoplay. */
export function HeroSlider({ slides, backdrop }: { slides: HeroSlide[]; backdrop?: string }) {
  const [index, setIndex] = useState(0);
  const swipeStart = useRef<number | null>(null);
  const count = slides.length;
  const current = slides[index];
  const next = count > 1 ? slides[(index + 1) % count] : undefined;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (count < 2) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    swipeStart.current = e.pointerType === "touch" ? e.clientX : null;
  };
  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    if (swipeStart.current === null || count < 2) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured scents"
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="relative isolate min-h-svh overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-[68svh] bg-page lg:inset-0 lg:h-auto">
        {backdrop && <Image src={backdrop} alt="" fill priority sizes="100vw" quality={90} className="object-cover" />}
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== index}
            className={cn("absolute inset-0 transition-opacity duration-[1100ms] ease-out", i === index ? "opacity-100" : "opacity-0")}
          >
            <ProductImage
              fill
              family={slide.family}
              src={slide.image.src}
              alt={slide.image.alt}
              style={slide.image.featherEdges ? { ...cropVars(slide.image), maskImage: ART_MASK, WebkitMaskImage: ART_MASK } : cropVars(slide.image)}
              priority={i === 0}
              sizes="100vw"
              className="scale-[1.02] [object-position:var(--pos-m,50%_50%)] lg:[object-position:var(--pos-d,var(--pos-m,50%_50%))]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-page via-page/25 to-transparent lg:bg-gradient-to-r lg:from-page/70 lg:via-page/20 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-page to-transparent lg:block" />
      </div>

      <Container className="grid min-h-svh items-end gap-10 pb-28 pt-[56svh] lg:items-center lg:pb-24 lg:pt-36 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="max-w-2xl">
          <h1 className="font-display text-[clamp(2.5rem,1.3rem+3.6vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-balance lg:max-w-[13.5ch] xl:max-w-none">
            Made in small batches from <Em>rare ingredients</Em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/75">
            Four scent families, blended by hand in twelve-litre lots and rested for six weeks before they are bottled.
          </p>
          <Button
            href="/shop"
            variant="secondary"
            size="lg"
            className="mt-9 rounded-pill border-ink/35 bg-page/30 px-8 text-xs uppercase tracking-[0.16em] backdrop-blur-sm"
          >
            Discover collection
            <ArrowRightIcon width={18} height={18} />
          </Button>
          <ul aria-label="Browse by scent family" className="mt-10 flex flex-wrap gap-2.5">
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

        {current && (
          <GlassPanel key={current.id} className="animate-hero-rise hidden w-full p-5 xl:block">
            <p data-testid="current-name" className="font-display text-2xl leading-tight">
              {current.name}
            </p>
            <p className="mt-1 text-sm text-ink/70">{current.concentration}</p>
            {next && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={`Show ${next.name}`}
                className="group relative mt-4 block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg border border-ink/15"
              >
                <ProductImage
                  fill
                  family={next.family}
                  src={next.image.src}
                  alt=""
                  objectPosition={next.image.objectPosition}
                  sizes="336px"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
                  <span className="grid size-12 place-items-center rounded-pill border border-ink/30 bg-page/40 text-ink backdrop-blur-md transition-colors group-hover:border-accent group-hover:text-accent">
                    <ChevronRightIcon />
                  </span>
                </span>
              </button>
            )}
            <p className="mt-4 text-sm text-ink/80">{current.tagline}</p>
            <p className="mt-1 text-sm text-ink/60">From {formatMoney(current.priceFromCents)}</p>
            <Link
              href={`/product/${current.slug}`}
              aria-label={`Explore ${current.name}`}
              className="mt-5 flex items-center justify-between border-t border-ink/15 pt-4 text-xs uppercase tracking-[0.16em] text-ink/90 transition-colors hover:text-accent"
            >
              Explore
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </GlassPanel>
        )}
      </Container>

      {count > 1 && current && (
        <div className="absolute inset-x-0 top-[calc(56svh-4.25rem)] z-10 lg:bottom-8 lg:top-auto">
          <Container className="flex items-center justify-between gap-4">
            <Link href={`/product/${current.slug}`} className="text-sm text-ink/85 underline-offset-4 hover:text-accent hover:underline xl:hidden">
              {current.name}
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <span className="mr-2 hidden text-sm tabular-nums text-ink/70 sm:inline">
                {index + 1} / {count}
              </span>
              <button type="button" aria-label="Previous scent" onClick={() => go(-1)} className={arrowButton}>
                <ChevronLeftIcon />
              </button>
              <button type="button" aria-label="Next scent" onClick={() => go(1)} className={arrowButton}>
                <ChevronRightIcon />
              </button>
            </div>
          </Container>
          <p className="sr-only" aria-live="polite">{`${index + 1} of ${count}: ${current.name}`}</p>
        </div>
      )}
    </section>
  );
}
