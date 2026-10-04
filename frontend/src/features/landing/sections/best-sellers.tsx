import Link from "next/link";
import { ProductImage } from "@/components/brand/product-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { GlassPanel } from "@/components/ui/glass-panel";
import { productRepository } from "@/data";
import { formatMoney } from "@/lib/format";
import { photoMedia } from "@/lib/media";
import { lowestPriceCents, isSoldOut } from "@/features/catalog/catalog-query";
import type { Product } from "@scentique/shared";

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
      className={className}
    />
  );
}

/** The leading best seller, large, with its notes pyramid on a glass panel. */
function Lead({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group grid items-center gap-8 md:grid-cols-12 md:gap-12">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl md:col-span-6 md:aspect-[5/6]">
        <Photo product={product} sizes="(min-width: 768px) 50vw, 100vw" className="transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]" />
      </div>
      <div className="md:col-span-6">
        <p className="text-xs uppercase tracking-[0.16em] text-accent">No. 1 this season</p>
        <h3 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">{product.name}</h3>
        <p className="mt-3 text-lg text-ink/80"><Em>{product.tagline}</Em></p>
        <GlassPanel className="mt-8 p-6">
          <dl className="grid grid-cols-3 gap-4 text-sm">
            {([["Top", product.notes.top], ["Heart", product.notes.heart], ["Base", product.notes.base]] as const).map(([label, notes]) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-2 text-ink/90">{notes.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </GlassPanel>
        <p className="mt-7 flex items-center gap-3 text-sm text-ink/80">
          From {formatMoney(lowestPriceCents(product))}
          <ArrowRightIcon width={16} height={16} className="text-accent transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}

/** The rest of the best sellers: an open row of photographs, no tiles or cards. */
function Runners({ products }: { products: Product[] }) {
  return (
    <ul className="mt-20 grid gap-10 sm:grid-cols-3 md:mt-24 md:gap-12">
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/product/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <Photo product={product} sizes="(min-width: 640px) 33vw, 100vw" className="transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]" />
            </div>
            <p className="mt-5 font-display text-2xl">{product.name}</p>
            <p className="mt-1 text-sm text-muted">{isSoldOut(product) ? "Sold out" : `From ${formatMoney(lowestPriceCents(product))}`}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function BestSellersSection() {
  const products = await productRepository.findBestSellers(4);
  const [lead, ...rest] = products;

  return (
    <section className="border-t border-line bg-surface py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">Best <Em>sellers</Em></h2>
          <Button href="/shop" variant="secondary">View the full shelf</Button>
        </div>

        {!lead ? (
          <p className="mt-12 text-muted">No scents are on the shelf right now.</p>
        ) : (
          <div className="mt-14">
            <Lead product={lead} />
            {rest.length > 0 && <Runners products={rest} />}
          </div>
        )}
      </Container>
    </section>
  );
}
