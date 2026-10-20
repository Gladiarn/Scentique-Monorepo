import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import type { Product, ScentFamily } from "@scentique/shared";
import { SORTS, SORT_LABELS, shopHref, type CatalogQuery } from "./catalog-query";
import { ProductCard } from "./product-card";

const FAMILIES: [ScentFamily, string][] = [
  ["woody", "Woody"],
  ["floral", "Floral"],
  ["citrus", "Citrus"],
  ["oud", "Oud"],
];

const chip = "inline-flex h-11 items-center rounded-pill border px-5 text-sm press";
const off = "border-ink/20 text-ink/80 hover:border-accent hover:text-ink";
const on = "border-accent text-ink";

/** The shop: filter by family, sort, a grid of scents and page links. Every choice is a link, so it works without scripts. */
export function ShopView({ products, total, query, pageCount }: { products: Product[]; total: number; query: CatalogQuery; pageCount: number }) {
  return (
    <Container className="pb-32">
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
        <nav aria-label="Filter by family">
          <ul className="flex flex-wrap gap-2.5">
            <li>
              <Link href={shopHref(query, { family: undefined })} aria-current={query.family ? undefined : "true"} className={cn(chip, query.family ? off : on)}>
                All
              </Link>
            </li>
            {FAMILIES.map(([family, label]) => (
              <li key={family}>
                <Link href={shopHref(query, { family })} aria-current={query.family === family ? "true" : undefined} className={cn(chip, query.family === family ? on : off)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Sort by">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {SORTS.map((sort) => (
              <li key={sort}>
                <Link href={shopHref(query, { sort })} aria-current={query.sort === sort ? "true" : undefined} className={cn("underline-offset-4 hover:text-ink hover:underline", query.sort === sort ? "text-ink underline" : "text-muted")}>
                  {SORT_LABELS[sort]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p aria-live="polite" className="mt-8 text-sm text-muted">
        {total} {total === 1 ? "scent" : "scents"}
      </p>

      {products.length === 0 ? (
        <div className="mt-10">
          <p className="text-lg text-ink/80">No scents match these filters.</p>
          <Link href="/shop" className="mt-4 inline-block text-accent underline-offset-4 hover:underline">
            Clear filters
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" />
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center gap-2.5">
          {query.page > 1 && (
            <Link href={shopHref(query, { page: query.page - 1 })} className={cn(chip, off)}>
              Previous page
            </Link>
          )}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={shopHref(query, { page: n })} aria-current={n === query.page ? "page" : undefined} className={cn(chip, "justify-center", n === query.page ? on : off)}>
              {n}
            </Link>
          ))}
          {query.page < pageCount && (
            <Link href={shopHref(query, { page: query.page + 1 })} className={cn(chip, off)}>
              Next page
            </Link>
          )}
        </nav>
      )}
    </Container>
  );
}
