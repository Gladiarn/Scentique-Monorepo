import { cn } from "@/lib/cn";

/** Loading placeholder: a calm tonal block, still for reduced-motion users. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-xl bg-surface", className)} />;
}
