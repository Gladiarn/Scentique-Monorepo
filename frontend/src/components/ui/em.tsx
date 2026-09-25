import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Highlighted words inside a headline: accent italic face, in the accent colour. Use sparingly, one phrase per heading. */
export function Em({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <em className={cn("font-accent font-normal italic text-accent", className)} {...props} />;
}
