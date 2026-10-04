import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { PageTitle } from "@/components/ui/page-title";
import { productRepository } from "@/data";
import { FilterPanel } from "@/features/catalog/filter-panel";
import { ProductCard } from "@/features/catalog/product-card";
import { parseCatalogQuery, sortProducts, toProductFilters } from "@/features/catalog/catalog-query";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = parseCatalogQuery(await searchParams);
  const [products, catalogue] = await Promise.all([productRepository.findAll(toProductFilters(query)), productRepository.findAll()]);
  const shown = sortProducts(products, query.sort);
  const highestCents = Math.max(...catalogue.flatMap((p) => p.variants.map((v) => v.priceCents)));
  const maxPriceDollars = Math.ceil(highestCents / 100 / 5) * 5;

  return (
    <Container className="py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <PageTitle>
          The <Em>shelf</Em>
        </PageTitle>
        <p className="text-sm text-muted">
          {shown.length} {shown.length === 1 ? "scent" : "scents"}
        </p>
      </div>

      <div className="mt-10">
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
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      )}
    </Container>
  );
}
