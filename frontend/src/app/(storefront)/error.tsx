"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function StorefrontError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="py-32">
      <h1 className="font-display text-3xl">We could not load this page</h1>
      <p className="mt-3 max-w-md text-muted">Something went wrong on our side. Try again, and if it keeps happening, come back in a few minutes.</p>
      <Button className="mt-8" onClick={reset}>Try again</Button>
    </Container>
  );
}
