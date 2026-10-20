"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/features/catalog/product-card";
import { QUESTIONS, recommend, type QuizAnswers } from "@/features/quiz/quiz-logic";
import { cn } from "@/lib/cn";
import type { Product } from "@scentique/shared";

const KEYS = QUESTIONS.map((q) => q.key);

const quiet = "text-sm text-muted underline-offset-4 hover:text-ink hover:underline";

/**
 * Four short questions, one at a time, then two or three scents to try. Calm and plain: this is a tool, so nothing on
 * it moves. The answers never leave the page.
 */
export function QuizSection({ products }: { products: Product[] }) {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const step = KEYS.filter((k) => answers[k]).length;
  const done = step === QUESTIONS.length;
  const picks = done ? recommend(answers, products) : [];
  const question = QUESTIONS[step];

  const answer = (key: keyof QuizAnswers, value: string) => setAnswers((a) => ({ ...a, [key]: value }) as QuizAnswers);
  const back = () => {
    const key = KEYS[step - 1];
    if (!key) return;
    setAnswers((a) => {
      const next = { ...a };
      delete next[key];
      return next;
    });
  };

  return (
    <section id="quiz" aria-labelledby="quiz-heading" className="surface-glow relative scroll-mt-20 py-28 md:py-36">
      <Container className="max-w-4xl">
        <h2 id="quiz-heading" className="font-display text-4xl leading-[1.08] text-balance md:text-[length:var(--text-4xl)]">
          {done ? "Two or three scents to try" : "Not sure where to start?"}
        </h2>
        <p className="mt-5 max-w-[56ch] text-lg text-ink/80">
          {done ? "Picked from your answers. Start with the first, and come back for the others." : "Answer four short questions and we will suggest two or three scents."}
        </p>

        {done ? (
          <div className="mt-12">
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} sizes="(min-width: 1024px) 28vw, 100vw" />
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setAnswers({})} className={cn(quiet, "mt-10")}>
              Retake the quiz
            </button>
          </div>
        ) : (
          question && (
            <div className="mt-12">
              <div className="flex items-center justify-between gap-6 text-sm text-muted">
                <p>
                  Question {step + 1} of {QUESTIONS.length}
                </p>
                {step > 0 && (
                  <button type="button" onClick={back} className={quiet}>
                    Back
                  </button>
                )}
              </div>
              <div role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={(step / QUESTIONS.length) * 100} className="mt-3 h-1 overflow-hidden rounded-pill bg-ink/15">
                <div className="h-full bg-accent transition-[width] duration-500 ease-out-quart" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
              </div>
              <p className="mt-10 font-display text-2xl md:text-3xl">{question.prompt}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {question.options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => answer(question.key, o.value)}
                    className="rounded-xl border border-ink/20 bg-surface/45 p-5 text-left backdrop-blur-glass transition-colors hover:border-accent"
                  >
                    <span className="block font-display text-xl">{o.label}</span>
                    <span className="mt-1 block text-sm text-muted">{o.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </Container>
    </section>
  );
}
