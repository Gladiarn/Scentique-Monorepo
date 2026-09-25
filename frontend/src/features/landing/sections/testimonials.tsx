import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { testimonialRepository } from "@/data";

export async function TestimonialsSection() {
  const testimonials = await testimonialRepository.findAll();
  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <h2 className="font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">What <Em>people</Em> say</h2>
        <ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {testimonials.map((t) => (
            <li key={t.id} className="md:px-10 md:first:pl-0 md:last:pr-0">
              <blockquote className="font-display text-xl leading-snug">{t.quote}</blockquote>
              <p className="mt-6 text-sm text-muted">{t.author}, {t.location}</p>
            </li>
          ))}
        </ul>
        <p className="mt-14 text-sm text-muted">Placeholder reviews for design purposes.</p>
      </Container>
    </section>
  );
}
