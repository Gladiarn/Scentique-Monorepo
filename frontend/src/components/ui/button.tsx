import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const glassButton =
  "inline-flex h-12 items-center justify-center gap-2 rounded-pill border border-ink/25 bg-surface/45 px-8 text-sm shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-accent)_40%,transparent)] backdrop-blur-glass transition-colors duration-200 hover:border-accent hover:text-accent";

/** The main call to action: smoked brown glass pill, set in sentence case. */
export function Button({ href, className, tabIndex, children }: { href: string; className?: string; tabIndex?: number; children: ReactNode }) {
  return (
    <Link href={href} tabIndex={tabIndex} className={cn(glassButton, className)}>
      {children}
    </Link>
  );
}
