import Link from "next/link";
import { ProductImage } from "@/components/brand/product-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { collectionRepository } from "@/data";
import { cn } from "@/lib/cn";
import type { Collection, ScentFamily } from "@scentique/shared";

/* Bento placement per family: one large lead tile, one tall, two small. */
const PLACEMENT: Record<ScentFamily, string> = {
  woody: "sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-1",
  oud: "lg:col-start-3 lg:row-start-1",
  citrus: "lg:col-start-3 lg:row-start-2",
  floral: "lg:col-start-4 lg:row-span-2 lg:row-start-1",
};

function FamilyTile({ collection, large }: { collection: Collection; large: boolean }) {
  const { media } = collection;
  return (
    <li className={PLACEMENT[collection.family]}>
      <Link
        href={`/shop?family=${collection.family}`}
        className="group relative block h-full min-h-[15rem] overflow-hidden rounded-xl border border-line"
      >
        <ProductImage
          fill
          family={collection.family}
          src={media.src}
          backdrop={media.backdrop}
          objectPosition={media.objectPosition}
          alt={media.alt}
          sizes="(min-width: 1024px) 25vw, 100vw"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page/90 via-page/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${collection.family})` }} />
            <h3 className={cn("font-display", large ? "text-3xl" : "text-2xl")}>{collection.name}</h3>
          </div>
          <p className="mt-2 max-w-[32ch] text-sm text-ink/75">{collection.blurb}</p>
          <span className="mt-3 inline-flex items-center gap-2 text-sm text-accent">
            Explore <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export async function CollectionsSection() {
  const collections = await collectionRepository.findAll();

  return (
    <section id="collections" className="pb-24 md:pb-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">Four families, one shelf</h2>
          <Button href="/shop" variant="ghost">Shop all scents</Button>
        </div>

        {collections.length === 0 ? (
          <p className="mt-12 text-muted">Collections are being prepared. Check back soon.</p>
        ) : (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 sm:auto-rows-[minmax(15rem,auto)] lg:grid-cols-4 lg:grid-rows-[15rem_15rem_auto]">
            {collections.map((c) => (
              <FamilyTile key={c.id} collection={c} large={c.family === "woody"} />
            ))}
            <li className="sm:col-span-2 lg:col-span-4 lg:row-start-3">
              <Link
                href="/quiz"
                className="group flex h-full min-h-[8rem] items-center justify-between gap-6 rounded-xl border border-accent/40 bg-raised px-7 py-6 transition-colors hover:border-accent md:px-10"
              >
                <div>
                  <p className="font-display text-2xl md:text-3xl">Not sure which family is yours?</p>
                  <p className="mt-1 text-muted">Answer four short questions and we will suggest two or three scents.</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-3 text-accent">
                  <span className="hidden text-sm sm:inline">Find your scent</span>
                  <span className="grid size-12 place-items-center rounded-pill border border-accent/60 transition-transform group-hover:translate-x-1">
                    <ArrowRightIcon />
                  </span>
                </span>
              </Link>
            </li>
          </ul>
        )}
      </Container>
    </section>
  );
}
