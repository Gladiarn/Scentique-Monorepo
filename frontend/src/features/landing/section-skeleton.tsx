import { cn } from "@/lib/cn";

/** Loading placeholder shared by landing sections. */
export function SectionSkeleton({ className }: { className?: string }) {
  return <div role="status" aria-label="Loading" className={cn("animate-pulse bg-surface", className)} />;
}
