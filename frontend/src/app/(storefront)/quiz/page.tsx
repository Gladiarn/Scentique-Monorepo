import type { Metadata } from "next";
import { WaveBackdrop } from "@/components/brand/wave-backdrop";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { ArrowRightIcon, ChevronLeftIcon } from "@/components/ui/icons";
import { productRepository } from "@/data";
import { ProductCard } from "@/features/catalog/product-card";
import { QUESTIONS, parseAnswers, recommend, type QuizAnswers } from "@/features/quiz/quiz-logic";

export const metadata: Metadata = { title: "Find your scent" };

type Raw = Record<string, string | string[] | undefined>;
const KEYS = ["notes", "occasion", "for", "strength"] as const;

/** Builds a URL for the quiz state, keeping every answer given so far. */
function hrefWith(answers: QuizAnswers, change?: [keyof QuizAnswers, string | undefined]): string {
  const next: Record<string, string | undefined> = { ...answers };
  if (change) next[change[0]] = change[1];
  const params = new URLSearchParams();
  for (const key of KEYS) if (next[key]) params.set(key, next[key] as string);
  const query = params.toString();
  return query ? `/quiz?${query}` : "/quiz";
}

export default async function QuizPage({ searchParams }: { searchParams: Promise<Raw> }) {
  const answers = parseAnswers(await searchParams);
  const answered = KEYS.filter((k) => answers[k]).length;
  const complete = answered === QUESTIONS.length;

  if (complete) {
    const products = await productRepository.findAll();
    const picks = recommend(answers, products);
    return (
      <section className="relative isolate overflow-hidden py-24 md:py-32">
        <WaveBackdrop />
        <Container className="relative">
          <h1 className="font-display text-3xl md:text-[length:var(--text-4xl)]">
            Two or three <Em>scents to try</Em>
          </h1>
          <p className="mt-4 max-w-xl text-ink/80">Picked from your answers. Start with the first, and come back for the others.</p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/quiz" variant="glass">Retake the quiz</Button>
            <Button href="/shop" variant="ghost">Browse the full shelf</Button>
          </div>
        </Container>
      </section>
    );
  }

  const step = answered;
  const question = QUESTIONS[step];
  const previous = step > 0 ? KEYS[step - 1] : undefined;

  return (
    <Container className="py-20 md:py-28">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between gap-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <div role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={step} className="h-px w-40 overflow-hidden rounded-pill bg-line">
            <div className="h-full bg-accent transition-[width] duration-500 ease-[var(--ease-out-quart)]" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
          </div>
        </div>

        <h1 className="mt-8 font-display text-4xl leading-[1.08] md:text-[length:var(--text-4xl)]">{question.prompt}</h1>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => (
            <li key={option.value}>
              <a
                href={hrefWith(answers, [question.key, option.value])}
                className="group flex items-center justify-between gap-4 rounded-xl border border-line px-6 py-5 transition-colors hover:border-accent"
              >
                <span>
                  <span className="block font-display text-2xl">{option.label}</span>
                  <span className="mt-1 block text-sm text-muted">{option.hint}</span>
                </span>
                <ArrowRightIcon width={18} height={18} className="shrink-0 text-accent transition-transform group-hover:translate-x-1" />
              </a>
            </li>
          ))}
        </ul>

        {previous && (
          <a href={hrefWith(answers, [previous, undefined])} className="mt-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent">
            <ChevronLeftIcon width={16} height={16} /> Back
          </a>
        )}
      </div>
    </Container>
  );
}
