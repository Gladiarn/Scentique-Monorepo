"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { cn } from "@/lib/cn";

const emailSchema = z.string().trim().email();

/** Stands in for the mailing list until there is a backend: it waits a moment and succeeds. */
const placeholderSubscribe = (): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, 400));

type State = "idle" | "invalid" | "sending" | "done" | "failed";

/** One field and one button. Names the problem and the fix, keeps what was typed, and never claims an email was sent. */
export function NewsletterForm({ subscribe = placeholderSubscribe, className }: { subscribe?: (email: string) => Promise<void>; className?: string }) {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setState("invalid");
    setState("sending");
    try {
      await subscribe(parsed.data);
      setState("done");
    } catch {
      setState("failed");
    }
  };

  return (
    <form onSubmit={submit} noValidate className={cn("w-full max-w-md", className)}>
      <label htmlFor="newsletter-email" className="block text-sm text-ink/80">
        Email
      </label>
      <div className="mt-2 flex rounded-md border border-ink/25 bg-surface/45 backdrop-blur-glass transition-colors duration-150 focus-within:border-accent">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === "invalid" ? true : undefined}
          aria-describedby="newsletter-message"
          className="h-12 min-w-0 flex-1 rounded-l-md bg-transparent px-4 text-ink outline-offset-[-2px] placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="h-12 rounded-r-md border-l border-ink/25 px-5 text-sm text-accent press hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Subscribe
        </button>
      </div>
      <div id="newsletter-message" className="mt-3 min-h-6 text-sm">
        {state === "invalid" && <p role="alert" className="text-danger">Enter an email like name@example.com.</p>}
        {state === "failed" && <p role="alert" className="text-danger">Could not subscribe. Check your connection and try again.</p>}
        {state === "done" && <p role="status" className="text-ink">Subscribed. Thank you for joining the seasonal letter.</p>}
      </div>
    </form>
  );
}
