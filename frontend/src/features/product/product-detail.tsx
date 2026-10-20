import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/features/catalog/product-card";
import type { Product } from "@scentique/shared";
import { PurchasePanel } from "./purchase-panel";

const TIERS = [
  ["Top", "top"],
  ["Heart", "heart"],
  ["Base", "base"],
] as const;

/** A product page: the real photographs, the scent and its notes, the way to buy it, and a few from the same family. */
export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const photos = product.media.filter((m) => m.role !== "hero" && m.src);
  return (
    <>
      <Container className="grid gap-12 pb-24 pt-32 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-5">
          {photos.map((m, i) => (
            <Reveal key={m.src} variant="wipe">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink/15 bg-surface">
                <Image
                  src={m.src!}
                  alt={m.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  quality={85}
                  style={m.objectPosition ? { objectPosition: m.objectPosition } : undefined}
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-2 text-sm capitalize text-ink/80">
            <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${product.family})` }} />
            {product.family}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.08] text-balance md:text-[length:var(--text-4xl)]">{product.name}</h1>
          <p className="mt-4 text-lg text-ink/80">{product.tagline}</p>
          <p className="mt-6 max-w-[56ch] text-ink/80">{product.description}</p>

          <ul aria-label="Fragrance notes" className="mt-10 space-y-4">
            {TIERS.map(([label, key]) => (
              <li key={key} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-4">
                <span className="text-sm text-accent">{label}</span>
                <span className="text-ink">{product.notes[key].join(", ")}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <PurchasePanel product={product} />
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="surface-umber py-24">
          <Container>
            <h2 id="related-heading" className="font-display text-3xl">
              You may also like
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} sizes="(min-width: 1024px) 30vw, 100vw" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
