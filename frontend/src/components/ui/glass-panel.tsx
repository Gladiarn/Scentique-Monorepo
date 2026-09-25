import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Plain glass for cards: only a light blur of whatever is behind it and a hairline border. It adds no colour of its
 * own (no fill, no sheen, no shadow), so the background shows through untouched.
 */
export function GlassPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative overflow-hidden rounded-xl border border-ink/20 backdrop-blur-glass", className)} {...props} />;
}
