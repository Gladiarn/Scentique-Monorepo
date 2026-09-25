import { WaveBackdrop } from "@/components/brand/wave-backdrop";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/** Closing banner in the capsule-render "waving" style, centred on a gradient with layered waves. */
export function ClosingSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <WaveBackdrop />
      <Container className="relative flex flex-col items-center py-32 text-center md:py-44">
        <h2 className="max-w-3xl font-display text-4xl leading-[1.08] text-balance md:text-[length:var(--text-display)]">Not sure where to start?</h2>
        <p className="mt-6 max-w-md text-lg text-ink/80">Answer four short questions and we will suggest two or three scents.</p>
        <Button href="/quiz" size="lg" className="mt-10">Find your scent</Button>
      </Container>
    </section>
  );
}
