import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  { title: "Blended by hand", detail: "In twelve-litre lots, around one rare raw material." },
  { title: "Rested for six weeks", detail: "Until the blend settles and the edges soften." },
  { title: "Bottled in small runs", detail: "Filled and checked one bottle at a time." },
] as const;

/**
 * Act two, the quiet act: how it is made. Still photography on a warm umber ground. The wide photograph is wiped open
 * as it arrives; two close-ups of raw materials drift over its corners at different depths (decoration only: the copy
 * never moves).
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="surface-umber relative scroll-mt-20 py-28 md:py-40">
      <Container className="grid items-center gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <h2 id="about-heading" className="font-display text-4xl leading-[1.08] text-balance md:text-[length:var(--text-4xl)]">
            A small house with a long process
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg text-ink/80">
            We make fewer scents than we could, and we make them slowly. Each one starts with a single raw material we want to show
            properly, then we build the rest of the blend around it until nothing is left to take away.
          </p>
          <ol className="mt-12 space-y-7">
            {STEPS.map(({ title, detail }) => (
              <li key={title}>
                <p className="font-display text-2xl">{title}</p>
                <p className="mt-1 text-muted">{detail}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative md:col-span-7">
          <Reveal variant="wipe">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink/15">
              <Image src="/images/categories/woody.webp" alt="Stacks of cedar and rosewood on a rough stone against dark velvet" fill sizes="(min-width: 768px) 58vw, 100vw" quality={80} className="object-cover" />
            </div>
          </Reveal>
          <Parallax depth="near" className="absolute -bottom-10 -left-4 hidden w-[34%] md:block lg:-left-10">
            <Image src="/images/ingredients/frankincense.webp" alt="Pale tears of frankincense resin" width={480} height={260} sizes="20vw" quality={85} className="rounded-xl border border-ink/15 object-cover" />
          </Parallax>
          <Parallax depth="far" className="absolute -right-4 -top-8 hidden w-[26%] md:block">
            <Image src="/images/ingredients/amber-resin.webp" alt="Chunks of dark amber resin" width={400} height={270} sizes="15vw" quality={85} className="rounded-xl border border-ink/15 object-cover" />
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
