import Link from "next/link";
import { ProductImage } from "@/components/brand/product-image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { productRepository } from "@/data";
import { formatMoney } from "@/lib/format";
import { photoMedia } from "@/lib/media";

export async function BestSellersSection() {
  const products = (await productRepository.findAll()).slice(0, 4);

  return (
    <section className="border-t border-line bg-surface py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">Best sellers</h2>
          <Button href="/shop" variant="secondary">View the full shelf</Button>
        </div>

        {products.length === 0 ? (
          <p className="mt-12 text-muted">No scents are on the shelf right now.</p>
        ) : (
          <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {products.map((p) => {
              const soldOut = p.variants.every((v) => v.stock === 0);
              const lowest = Math.min(...p.variants.map((v) => v.priceCents));
              return (
                <li key={p.id}>
                  <Link href={`/product/${p.slug}`} className="group block">
                    <ProductImage
                      family={p.family}
                      src={photoMedia(p)?.src}
                      backdrop={photoMedia(p)?.backdrop}
                      objectPosition={photoMedia(p)?.objectPosition}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      alt={photoMedia(p)?.alt ?? p.name}
                      className="aspect-[4/5] w-full rounded-lg border border-line transition-colors group-hover:border-accent"
                    />
                    <div className="mt-4 flex items-center gap-2">
                      <span className="size-2 rounded-pill" style={{ background: `var(--color-${p.family})` }} aria-hidden="true" />
                      <h3 className="font-display text-xl">{p.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                    <p className="mt-3 text-sm">{soldOut ? "Sold out" : `From ${formatMoney(lowest)}`}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}
