import Link from "next/link";
import { ProductImage } from "@/components/brand/product-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { collectionRepository } from "@/data";

export async function CollectionsSection() {
  const collections = await collectionRepository.findAll();

  return (
    <section id="collections" className="border-t border-line py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">Four families, one shelf</h2>
          <Button href="/shop" variant="ghost">Shop all scents</Button>
        </div>

        {collections.length === 0 ? (
          <p className="mt-12 text-muted">Collections are being prepared. Check back soon.</p>
        ) : (
          <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((c) => (
              <li key={c.id} className="lg:nth-child(even):mt-14">
                <Link href={`/shop?family=${c.family}`} className="group block">
                  <div className="overflow-hidden rounded-lg border border-line">
                    <ProductImage
                      family={c.family}
                      alt={c.media.alt}
                      className="aspect-[3/4] w-full transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-2xl">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted">{c.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm text-accent">
                    Explore <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
