"use client";

import { useEffect, useRef, type RefObject } from "react";
import { sectionEdges, sectionProgress } from "./scrub";

/**
 * Calls `onProgress` (0..1, plus how far the section has entered and is leaving) as the nearest `[data-scrub-section]`
 * ancestor of `ref` scrolls, once per frame.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, onProgress: (progress: number, edges: { enter: number; exit: number }) => void, enabled = true) {
  const latest = useRef(onProgress);
  useEffect(() => {
    latest.current = onProgress;
  });

  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-scrub-section]");
    if (!enabled || !section) return;
    let frame = 0;
    const run = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      latest.current(sectionProgress(rect, vh), sectionEdges({ top: rect.top, bottom: rect.top + rect.height }, vh));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, enabled]);
}
