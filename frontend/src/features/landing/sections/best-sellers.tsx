import Link from "next/link";
import { ProductImage } from "@/components/brand/product-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { GlassPanel } from "@/components/ui/glass-panel";
import { productRepository } from "@/data";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { photoMedia } from "@/lib/media";
import type { Product } from "@scentique/shared";

const lowestPrice = (p: Product) => Math.min(...p.variants.map((v) => v.priceCents));
const isSoldOut = (p: Product) => p.variants.every((v) => v.stock === 0);

function Photo({ product, sizes, className }: { product: Product; sizes: string; className?: string }) {
  const media = photoMedia(product);
  return (
    <ProductImage
      fill
      family={product.family}
      src={media?.src}
      backdrop={media?.backdrop}
      objectPosition={media?.objectPosition}
      alt={media?.alt ?? product.name}
      sizes={sizes}
      className={cn("absolute inset-0 h-full w-full transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]", className)}
    />
  );
}

function FeaturedTile({ product }: { product: Product }) {
  return (
    <li className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
      <Link href={`/product/${product.slug}`} className="group relative block h-full min-h-[32rem] overflow-hidden rounded-xl border border-line">
        <Photo product={product} sizes="(min-width: 1024px) 50vw, 100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page/85 via-transparent to-page/10" />
        <div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5">
          <GlassPanel className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl leading-tight">{product.name}</h3>
                <p className="mt-1 text-sm text-ink/75">{product.tagline}</p>
              </div>
              <span className="shrink-0 text-sm">From {formatMoney(lowestPrice(product))}</span>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-ink/15 pt-4 text-sm">
              {([["Top", product.notes.top], ["Heart", product.notes.heart], ["Base", product.notes.base]] as const).map(([label, notes]) => (
                <div key={label}>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="mt-1 text-ink/90">{notes.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </GlassPanel>
        </div>
      </Link>
    </li>
  );
}

function SmallTile({ product, wide }: { product: Product; wide?: boolean }) {
  const soldOut = isSoldOut(product);
  return (
    <li className={wide ? "sm:col-span-2 lg:col-span-2" : undefined}>
      <Link
        href={`/product/${product.slug}`}
        className={cn(
          "group relative block h-full min-h-[15rem] overflow-hidden rounded-xl border border-line transition-colors hover:border-accent/60",
          wide && "bg-surface",
        )}
      >
        <div className={cn("absolute inset-y-0 left-0", wide ? "w-1/2" : "right-0")}>
          <Photo product={product} sizes={wide ? "25vw" : "25vw"} />
        </div>
        {!wide && <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page/90 via-page/10 to-transparent" />}
        <div className={cn("absolute", wide ? "inset-y-0 right-0 flex w-1/2 flex-col justify-center gap-2 p-6" : "inset-x-0 bottom-0 p-5")}>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${product.family})` }} />
            <h3 className={cn("font-display", wide ? "text-2xl" : "text-lg leading-tight")}>{product.name}</h3>
          </div>
          {wide && <p className="text-sm text-ink/70">{product.tagline}</p>}
          <p className="flex items-center justify-between text-sm">
            <span>{soldOut ? "Sold out" : `From ${formatMoney(lowestPrice(product))}`}</span>
            <ArrowRightIcon width={16} height={16} className="text-accent transition-transform group-hover:translate-x-1" />
          </p>
        </div>
      </Link>
    </li>
  );
}

export async function BestSellersSection() {
  const products = await productRepository.findBestSellers(4);
  const [featured, second, third, fourth] = products;

  return (
    <section className="border-t border-line bg-surface py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">Best <Em>sellers</Em></h2>
          <Button href="/shop" variant="secondary">View the full shelf</Button>
        </div>

        {!featured ? (
          <p className="mt-12 text-muted">No scents are on the shelf right now.</p>
        ) : (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 sm:auto-rows-[minmax(15rem,auto)] lg:grid-cols-4 lg:grid-rows-[15rem_15rem]">
            <FeaturedTile product={featured} />
            {second && <SmallTile product={second} />}
            {third && <SmallTile product={third} />}
            {fourth && <SmallTile product={fourth} wide />}
          </ul>
        )}
      </Container>
    </section>
  );
}
