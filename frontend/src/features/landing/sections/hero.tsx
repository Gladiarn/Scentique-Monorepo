import Link from "next/link";
import { WavyBackground } from "@/components/brand/wavy-background";
import { ProductImage } from "@/components/brand/product-image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { productRepository } from "@/data";
import { formatMoney } from "@/lib/format";
import type { ScentFamily } from "@scentique/shared";

const families: ScentFamily[] = ["woody", "floral", "citrus", "oud"];

export async function HeroSection() {
  const [featured] = await productRepository.findFeatured();
  const lowest = featured ? Math.min(...featured.variants.map((v) => v.priceCents)) : null;

  return (
    <section className="relative isolate overflow-hidden">
      <WavyBackground className="opacity-70 [mask-image:linear-gradient(to_bottom,black_50%,transparent)]" />
      <Container className="relative grid items-center gap-14 pb-16 pt-36 lg:min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <h1 className="font-display text-[length:var(--text-display)] leading-[1.02] tracking-[-0.02em] text-balance">
            Made in small batches from rare ingredients
          </h1>
          <p className="mt-7 max-w-md text-lg text-muted">
            Four scent families, blended by hand in twelve-litre lots and rested for six weeks before they are bottled.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={featured ? `/product/${featured.slug}` : "/shop"} size="lg">
              {featured ? `Shop ${featured.name}` : "Shop all scents"}
            </Button>
            <Button href="/quiz" variant="secondary" size="lg">Find your scent</Button>
          </div>
          <ul aria-label="Browse by scent family" className="mt-12 flex flex-wrap gap-2">
            {families.map((family) => (
              <li key={family}>
                <Link
                  href={`/shop?family=${family}`}
                  className="inline-flex h-10 items-center gap-2 rounded-pill border px-4 text-sm capitalize transition-colors hover:bg-raised"
                  style={{ borderColor: `color-mix(in oklab, var(--color-${family}) 70%, transparent)` }}
                >
                  <span className="size-2 rounded-pill" style={{ background: `var(--color-${family})` }} />
                  {family}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <ProductImage
            family={featured?.family ?? "oud"}
            alt={featured?.media[0]?.alt ?? "Signature perfume bottle"}
            className="aspect-[4/5] w-full rounded-lg border border-line"
          />
          {featured && (
            <Link
              href={`/product/${featured.slug}`}
              className="absolute -bottom-5 left-4 right-4 rounded-lg border border-line bg-surface p-5 transition-colors hover:border-accent sm:left-auto sm:right-6 sm:w-72"
            >
              <p className="font-display text-xl">{featured.name}</p>
              <p className="mt-1 text-sm text-muted">{featured.tagline}</p>
              {lowest !== null && <p className="mt-3 text-sm">From {formatMoney(lowest)}</p>}
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
