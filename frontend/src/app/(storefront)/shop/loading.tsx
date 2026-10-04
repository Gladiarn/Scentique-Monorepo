import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <Container className="pt-44 pb-20 md:pt-48 md:pb-28">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-10 h-28 w-full" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="aspect-[4/5]" />)}
      </div>
    </Container>
  );
}
