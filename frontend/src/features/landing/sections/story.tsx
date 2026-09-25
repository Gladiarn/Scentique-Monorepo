import { Container } from "@/components/ui/container";

const process = [
  "Blended by hand in twelve-litre lots",
  "Rested for six weeks before bottling",
  "Four scent families on one small shelf",
];

/** Static brand copy (placeholder). */
export function StorySection() {
  return (
    <section id="craft" className="border-t border-line py-28 md:py-36">
      <Container className="grid gap-14 lg:grid-cols-12">
        <h2 className="font-display text-4xl leading-[1.08] text-balance lg:col-span-6 md:text-[length:var(--text-4xl)]">
          A small house with a long process
        </h2>
        <div className="space-y-8 lg:col-span-5 lg:col-start-8">
          <p className="max-w-[62ch] text-lg text-muted">
            We make fewer scents than we could, and we make them slowly. Each one starts with a single raw material we
            want to show properly, then we build the rest of the blend around it until nothing is left to take away.
          </p>
          <ul className="divide-y divide-line border-y border-line">
            {process.map((line) => (
              <li key={line} className="py-4 text-ink">{line}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
