import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const glass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-pill border border-ink/25 bg-surface/45 px-8 text-xs uppercase tracking-[0.16em] shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-accent)_40%,transparent)] backdrop-blur-glass transition-colors duration-200 hover:border-accent hover:text-accent";

/** The main call to action: smoked brown glass pill. */
export function Button({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={cn(glass, className)}>
      {children}
    </Link>
  );
}
