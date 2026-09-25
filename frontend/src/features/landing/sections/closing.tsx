import { WaveBackdrop } from "@/components/brand/wave-backdrop";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";

/** Closing banner in the capsule-render "waving" style, centred on a gradient with layered waves. */
export function ClosingSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <WaveBackdrop />
      <Container className="relative flex flex-col items-center pb-32 pt-52 text-center md:pb-44 md:pt-72">
        <h2 className="max-w-3xl font-display text-4xl leading-[1.08] text-balance md:text-[length:var(--text-display)]">Not sure <Em>where to start</Em>?</h2>
        <p className="mt-6 max-w-md text-lg text-ink/80">Answer four short questions and we will suggest two or three scents.</p>
        <Button href="/quiz" size="lg" className="mt-10">Find your scent</Button>
      </Container>
    </section>
  );
}
