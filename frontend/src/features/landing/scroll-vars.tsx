"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useSectionProgress } from "@/lib/use-section-progress";

/**
 * Publishes the enclosing `[data-scrub-section]`'s scroll state as CSS variables on that section: `--p` (progress, 0..1),
 * `--e` (how far it has entered) and `--x` (how far it has left). Planes and edge fades use `calc(var(--p, 0) * ...)`, so
 * scrolling never re-renders React. Under reduced motion nothing is set
 * and every plane stays at its resting place.
 */
export function ScrollVars() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useSectionProgress(
    ref,
    (progress, { enter, exit }) => {
      const style = ref.current?.closest<HTMLElement>("[data-scrub-section]")?.style;
      style?.setProperty("--p", progress.toFixed(4));
      style?.setProperty("--e", enter.toFixed(4));
      style?.setProperty("--x", exit.toFixed(4));
    },
    !reduced,
  );
  return <span ref={ref} hidden aria-hidden="true" />;
}
