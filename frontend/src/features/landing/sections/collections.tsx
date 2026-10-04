import Link from "next/link";
import { ProductImage } from "@/components/brand/product-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { GlassPanel } from "@/components/ui/glass-panel";
import { collectionRepository } from "@/data";
import { cn } from "@/lib/cn";
import type { Collection } from "@scentique/shared";

/** Four families as full-width editorial rows, alternating photograph side. No grid of tiles. */
function FamilyRow({ collection, reversed }: { collection: Collection; reversed: boolean }) {
  const { media } = collection;
  return (
    <li className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
      <Link
        href={`/shop?family=${collection.family}`}
        className={cn("group relative block aspect-[4/3] overflow-hidden rounded-xl md:col-span-7 md:aspect-[16/10]", reversed && "md:order-2")}
      >
        <ProductImage
          fill
          family={collection.family}
          src={media.src}
          backdrop={media.backdrop}
          objectPosition={media.objectPosition}
          alt={media.alt}
          sizes="(min-width: 768px) 58vw, 100vw"
          className="transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
        />
      </Link>
      <div className={cn("md:col-span-5", reversed && "md:order-1")}>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${collection.family})` }} />
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{collection.family}</p>
        </div>
        <h3 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">{collection.name}</h3>
        <p className="mt-5 max-w-[36ch] text-ink/75">{collection.blurb}</p>
        <Link href={`/shop?family=${collection.family}`} className="mt-7 inline-flex items-center gap-2 text-sm text-accent underline-offset-4 hover:underline">
          Explore {collection.family} <ArrowRightIcon width={16} height={16} />
        </Link>
      </div>
    </li>
  );
}

export async function CollectionsSection() {
  const collections = await collectionRepository.findAll();

  return (
    <section id="collections" className="pb-24 md:pb-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">Four families, <Em>one shelf</Em></h2>
          <Button href="/shop" variant="ghost">Shop all scents</Button>
        </div>

        {collections.length === 0 ? (
          <p className="mt-12 text-muted">Collections are being prepared. Check back soon.</p>
        ) : (
          <ul className="mt-14 space-y-16 md:space-y-24">
            {collections.map((c, i) => (
              <FamilyRow key={c.id} collection={c} reversed={i % 2 === 1} />
            ))}
          </ul>
        )}

        <GlassPanel className="mt-20 transition-colors hover:border-accent/50">
          <Link href="/quiz" className="group flex min-h-[8rem] items-center justify-between gap-6 px-7 py-6 md:px-10">
            <div>
              <p className="font-display text-2xl md:text-3xl">Not sure which family is <Em>yours</Em>?</p>
              <p className="mt-1 text-muted">Answer four short questions and we will suggest two or three scents.</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-3 text-accent">
              <span className="hidden text-sm sm:inline">Find your scent</span>
              <span className="grid size-12 place-items-center rounded-pill border border-accent/60 transition-transform group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </span>
          </Link>
        </GlassPanel>
      </Container>
    </section>
  );
}
