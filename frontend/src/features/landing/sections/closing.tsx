import { WavyBackground } from "@/components/brand/wavy-background";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function ClosingSection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-surface">
      <WavyBackground className="opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)]" />
      <Container className="relative py-28 md:py-40">
        <h2 className="max-w-2xl font-display text-4xl leading-[1.08] text-balance md:text-[length:var(--text-4xl)]">Not sure where to start?</h2>
        <p className="mt-5 max-w-md text-lg text-muted">Answer four short questions and we will suggest two or three scents.</p>
        <Button href="/quiz" size="lg" className="mt-10">Find your scent</Button>
      </Container>
    </section>
  );
}
