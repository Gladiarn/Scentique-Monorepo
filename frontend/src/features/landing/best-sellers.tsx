import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { productRepository } from "@/data";
import { ProductCard } from "@/features/catalog/product-card";
import { ScrollVars } from "./scroll-vars";

/**
 * Act three, the range, as a lateral pan: on wide screens the section is tall and the shelf slides sideways as you
 * scroll down (the scroll variable `--p` moves the track). On phones, and under reduced motion, it is a plain swipe row,
 * so every scent stays reachable.
 */
export async function BestSellers() {
  const products = await productRepository.findBestSellers(6);

  return (
    <section id="shop" aria-labelledby="shop-heading" data-scrub-section="" className="relative scroll-mt-20 md:h-[240svh] md:motion-reduce:h-auto">
      <ScrollVars />
      <div className="py-24 md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:overflow-hidden md:py-0 md:motion-reduce:static md:motion-reduce:h-auto md:motion-reduce:overflow-visible md:motion-reduce:py-24">
        <Container className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="shop-heading" className="font-display text-4xl leading-[1.08] text-balance md:text-[length:var(--text-4xl)]">
            Best sellers
          </h2>
          <Button href="/shop">View all perfumes</Button>
        </Container>

        {products.length === 0 ? (
          <Container>
            <p className="mt-12 text-muted">No scents are on the shelf right now.</p>
          </Container>
        ) : (
          <ul className="mt-12 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:w-max md:scroll-px-0 md:snap-none md:overflow-visible md:px-10 md:[transform:translate3d(calc((100vw-100%)*var(--p,0)),0,0)] motion-reduce:overflow-x-auto motion-reduce:transform-none! md:motion-reduce:w-auto md:motion-reduce:snap-x">
            {products.map((p) => (
              <li key={p.id} className="w-[min(78vw,20rem)] shrink-0 snap-start md:snap-align-none">
                <ProductCard product={p} sizes="(min-width: 768px) 20rem, 78vw" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
