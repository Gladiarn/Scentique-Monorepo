import type { Metadata } from "next";
import { InfoPage } from "@/features/info/info-page";

export const metadata: Metadata = { title: "Questions" };

const QUESTIONS = [
  ["How do I choose a scent?", "Take the four-question quiz, or browse by family. Each product page lists its notes from top to base."],
  ["What do the concentrations mean?", "Eau de toilette is the lightest, eau de parfum is the everyday balance, and extrait is the most intense and longest-lasting."],
  ["Can I buy a gift?", "Yes. Choose any scent and send it as you like. Gift wrapping options are being finalised."],
] as const;

export default function FaqPage() {
  return (
    <InfoPage title="Common" accent="questions" lead="The things people ask us most often.">
      <dl className="space-y-10">
        {QUESTIONS.map(([question, answer]) => (
          <div key={question}>
            <dt className="font-display text-2xl text-ink">{question}</dt>
            <dd className="mt-3">{answer}</dd>
          </div>
        ))}
      </dl>
    </InfoPage>
  );
}
