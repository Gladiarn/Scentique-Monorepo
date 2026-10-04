import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/** Shared 404 body: used by the storefront's not-found.tsx (segment 404s, wrapped in header/footer) and the root not-found.tsx (unmatched URLs). */
export function NotFoundContent() {
  return (
    <Container className="pt-44 pb-32">
      <p className="font-display text-2xl text-muted">404</p>
      <h1 className="mt-2 font-display text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">The page you are looking for does not exist, or the link is out of date. Try the shop, or head back home.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/shop">Shop all scents</Button>
        <Button href="/" variant="secondary">Back to home</Button>
      </div>
    </Container>
  );
}
