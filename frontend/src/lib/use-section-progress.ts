"use client";

import { useEffect, useRef, type RefObject } from "react";
import { sectionProgress } from "./scrub";

/** Calls `onProgress` (0..1) as the nearest `[data-scrub-section]` ancestor of `ref` scrolls, once per frame. */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, onProgress: (progress: number) => void, enabled = true) {
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
      latest.current(sectionProgress(section.getBoundingClientRect(), window.innerHeight));
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
