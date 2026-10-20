import { Container } from "@/components/ui/container";
import { Parallax, type Depth } from "@/components/motion/parallax";
import { testimonialRepository } from "@/data";

const DEPTHS: Depth[] = ["far", "near", "mid"];

/** Act four, proof: large quotes that drift past each other at different depths. The placeholder note stays. */
export async function Reviews() {
  const testimonials = await testimonialRepository.findAll();
  if (testimonials.length === 0) return null;
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="relative scroll-mt-20 py-28 md:py-40">
      <Container>
        <h2 id="reviews-heading" className="font-display text-4xl leading-[1.08] text-balance md:text-[length:var(--text-4xl)]">
          What people say
        </h2>
        <ul className="mt-16 grid gap-16 md:grid-cols-3 md:gap-10">
          {testimonials.map((t, i) => (
            <li key={t.id}>
              <Parallax depth={DEPTHS[i % DEPTHS.length]!}>
                <blockquote className="font-display text-2xl leading-snug md:text-[length:var(--text-2xl)]">{t.quote}</blockquote>
                <p className="mt-6 text-sm text-muted">
                  {t.author}, {t.location}
                </p>
              </Parallax>
            </li>
          ))}
        </ul>
        <p className="mt-16 text-sm text-muted">Placeholder reviews for design purposes.</p>
      </Container>
    </section>
  );
}
