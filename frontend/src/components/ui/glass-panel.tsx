import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Frosted-glass surface for floating cards over photography: translucent, blurred, hairline edge, faint top sheen. */
export function GlassPanel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-ink/15 bg-page/35 backdrop-blur-glass",
        "shadow-[0_28px_60px_-24px_rgb(0_0_0/0.75)]",
        className,
      )}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/[0.09] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}
