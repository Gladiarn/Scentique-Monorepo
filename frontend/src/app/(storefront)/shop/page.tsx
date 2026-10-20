import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";
import { productRepository } from "@/data";
import { SHOP_PAGE_SIZE, parseCatalogQuery, sortProducts, toProductFilters } from "@/features/catalog/catalog-query";
import { ShopView } from "@/features/catalog/shop-view";
import { pageSlice } from "@/lib/paginate";

export const metadata: Metadata = { title: "Shop" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const query = parseCatalogQuery(await searchParams);
  const all = sortProducts(await productRepository.findAll(toProductFilters(query)), query.sort);
  const { items, page, count } = pageSlice(all, query.page, SHOP_PAGE_SIZE);
  return (
    <>
      <Container>
        <PageTitle lead="Four families, blended by hand in small batches.">Shop</PageTitle>
      </Container>
      <ShopView products={items} total={all.length} query={{ ...query, page }} pageCount={count} />
    </>
  );
}
