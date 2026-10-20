import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Page gutters and maximum width. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-7xl px-6 md:px-10", className)} {...props} />;
}
