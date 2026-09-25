import Link from "next/link";
import type { CSSProperties } from "react";
import { ProductImage } from "@/components/brand/product-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/format";
import type { ScentFamily } from "@scentique/shared";
import type { HeroContent } from "./hero-content";

const FAMILIES: ScentFamily[] = ["floral", "woody", "citrus", "oud"];

const chip =
  "inline-flex h-11 items-center gap-2.5 rounded-pill border border-ink/25 bg-page/30 px-5 text-xs uppercase tracking-[0.16em] text-ink/90 backdrop-blur-glass transition-colors hover:border-accent hover:text-ink";

/** Crop position of the art: one for narrow screens, one for wide, so the bottle lands between the headline and the card. */
function cropVars(image: HeroContent["image"]): CSSProperties {
  return { "--pos-m": image.objectPosition, "--pos-d": image.objectPositionDesktop } as CSSProperties;
}

/** Full-bleed hero with one featured scent. Static: the background does not change. */
export function Hero({ content }: { content: HeroContent | null }) {
  return (
    <section aria-label="Featured scent" className="relative isolate min-h-svh overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[68svh] bg-page lg:inset-0 lg:h-auto">
        {content?.image.src && (
          <ProductImage
            fill
            priority
            family={content.family}
            src={content.image.src}
            alt={content.image.alt}
            sizes="100vw"
            style={cropVars(content.image)}
            className="[object-position:var(--pos-m,50%_50%)] lg:[object-position:var(--pos-d,var(--pos-m,50%_50%))]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-page via-page/25 to-transparent lg:bg-gradient-to-r lg:from-page/70 lg:via-page/20 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-page to-transparent" />
      </div>

      <Container className="grid min-h-svh items-end gap-10 pb-28 pt-[56svh] lg:items-center lg:pb-24 lg:pt-36 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="max-w-2xl">
          <h1 className="font-display text-[clamp(2.5rem,1.3rem+3.6vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-balance lg:max-w-[13.5ch] xl:max-w-none">
            Made in small batches from <Em>rare ingredients</Em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/75">
            Four scent families, blended by hand in twelve-litre lots and rested for six weeks before they are bottled.
          </p>
          <Button href="/shop" variant="glass" size="lg" className="mt-9">
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

        {content && (
          <Link
            href={`/product/${content.slug}`}
            aria-label={`Explore ${content.name}`}
            className="group hidden w-full xl:block"
          >
            <GlassPanel className="p-4 transition-colors duration-300 group-hover:border-accent/50">
              {content.photo?.src && (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                  <ProductImage
                    fill
                    family={content.family}
                    src={content.photo.src}
                    alt=""
                    objectPosition={content.photo.objectPosition}
                    sizes="336px"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              )}

              <div className="px-1 pt-5">
                <p data-testid="hero-scent-name" className="font-display text-[1.625rem] leading-tight">
                  {content.name}
                </p>
                <p className="mt-1 text-sm text-ink/70">{content.concentration}</p>

                <dl className="mt-5 space-y-3.5 text-sm">
                  {(
                    [
                      ["Top", content.notes.top],
                      ["Heart", content.notes.heart],
                      ["Base", content.notes.base],
                    ] as const
                  ).map(([label, notes]) => (
                    <div key={label} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-3">
                      <dt className="text-xs text-ink/55">{label}</dt>
                      <dd className="text-ink/90">{notes.join(", ")}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex items-center justify-between pb-1">
                  <p className="text-sm text-ink/80">From {formatMoney(content.priceFromCents)}</p>
                  <span className="grid size-11 place-items-center rounded-pill border border-ink/30 backdrop-blur-glass transition-colors group-hover:border-accent group-hover:text-accent">
                    <ArrowRightIcon width={18} height={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </GlassPanel>
          </Link>
        )}
      </Container>

      {content && (
        <div className="absolute inset-x-0 bottom-6 z-10 xl:hidden">
          <Container>
            <Link
              href={`/product/${content.slug}`}
              className="flex items-center justify-between gap-4 rounded-pill border border-ink/20 bg-page/40 px-6 py-3 text-sm backdrop-blur-glass transition-colors hover:border-accent"
            >
              <span className="font-display text-lg">{content.name}</span>
              <span className="inline-flex items-center gap-2 text-ink/80">
                Explore <ArrowRightIcon width={16} height={16} />
              </span>
            </Link>
          </Container>
        </div>
      )}
    </section>
  );
}
