"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useSectionProgress } from "@/lib/use-section-progress";

/**
 * Publishes the scroll progress of the enclosing `[data-scrub-section]` as the CSS variable `--p` (0..1) on that section.
 * Planes move with `calc(var(--p, 0) * ...)`, so scrolling never re-renders React. Under reduced motion nothing is set
 * and every plane stays at its resting place.
 */
export function ScrollVars() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useSectionProgress(
    ref,
    (progress) => ref.current?.closest<HTMLElement>("[data-scrub-section]")?.style.setProperty("--p", progress.toFixed(4)),
    !reduced,
  );
  return <span ref={ref} hidden aria-hidden="true" />;
}
