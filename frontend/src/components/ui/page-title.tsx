import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Page title at the hero's display scale: large Prata, tight tracking, one italic accent phrase via Em. */
export function PageTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("font-display text-[clamp(2.5rem,1.3rem+3.6vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-balance", className)}
      {...props}
    />
  );
}
