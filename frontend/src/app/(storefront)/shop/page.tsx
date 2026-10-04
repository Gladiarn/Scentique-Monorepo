import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { PageTitle } from "@/components/ui/page-title";
import { productRepository } from "@/data";
import { FilterPanel } from "@/features/catalog/filter-panel";
import { ProductCard } from "@/features/catalog/product-card";
import { SHOP_PAGE_SIZE, parseCatalogQuery, sortProducts, toProductFilters } from "@/features/catalog/catalog-query";
import { Pagination } from "@/components/ui/pagination";
import { pageSlice } from "@/lib/paginate";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const query = parseCatalogQuery(raw);
  const [products, catalogue] = await Promise.all([productRepository.findAll(toProductFilters(query)), productRepository.findAll()]);
  const sorted = sortProducts(products, query.sort);
  const { items: shown, page, count } = pageSlice(sorted, query.page, SHOP_PAGE_SIZE);
  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(raw)) {
      const first = Array.isArray(value) ? value[0] : value;
      if (first && key !== "page") params.set(key, first);
    }
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  };
  const highestCents = Math.max(...catalogue.flatMap((p) => p.variants.map((v) => v.priceCents)));
  const maxPriceDollars = Math.ceil(highestCents / 100 / 5) * 5;

  return (
    <Container className="pt-44 pb-20 md:pt-48 md:pb-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <PageTitle>
          The <Em>shelf</Em>
        </PageTitle>
        <p className="text-sm text-muted">
          {sorted.length} {sorted.length === 1 ? "scent" : "scents"}
        </p>
      </div>

      <div className="mt-12">
        <Suspense fallback={null}>
          <FilterPanel maxPriceDollars={maxPriceDollars} />
        </Suspense>
      </div>

      {shown.length === 0 ? (
        <div className="mt-16 max-w-md">
          <p className="font-display text-2xl">No scents match these filters</p>
          <p className="mt-3 text-muted">Try a wider price range or another scent family.</p>
          <Button href="/shop" variant="secondary" className="mt-8">Clear filters</Button>
        </div>
      ) : (
        <>
          <ul className="mt-16 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
          <div className="mt-16">
            <Pagination page={page} pageCount={count} hrefFor={hrefFor} label="Shop pages" />
          </div>
        </>
      )}
    </Container>
  );
}
