import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** The italic accent phrase inside a headline: accent face, accent colour. One per heading at most. */
export function Em({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <em className={cn("font-accent font-normal italic text-accent", className)} {...props} />;
}
