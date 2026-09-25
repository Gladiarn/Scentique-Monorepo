import { WaveBackdrop } from "@/components/brand/wave-backdrop";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";

/** Closing banner: tonal waves on both edges with the text directly on them. Kept short on purpose. */
export function ClosingSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <WaveBackdrop />
      <Container className="relative flex flex-col items-center py-24 text-center md:py-28">
        <h2 className="max-w-2xl font-display text-3xl leading-[1.12] text-balance md:text-4xl">
          Not sure <Em>where to start</Em>?
        </h2>
        <p className="mt-4 max-w-sm text-ink/80">Answer four short questions and we will suggest two or three scents.</p>
        <Button href="/quiz" variant="glass" size="lg" className="mt-8">
          Find your scent
          <ArrowRightIcon width={18} height={18} />
        </Button>
      </Container>
    </section>
  );
}
