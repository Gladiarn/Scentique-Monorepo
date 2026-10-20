"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { easeToward, sectionProgress, videoTimeAt } from "@/lib/scrub";

interface ScrubVideoProps {
  /** Wide clip for large screens and its portrait twin for phones. */
  src: string;
  srcMobile: string;
  /** Each clip's own first frame, shown at once and kept as the still under reduced motion. */
  poster: string;
  posterMobile: string;
  label: string;
  className?: string;
}

const WIDE = "(min-width: 768px)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const never = () => () => {};

/**
 * A clip you scrub with the scroll wheel. It sits in a tall `[data-scrub-section]`; as that section scrolls, the playhead
 * follows. The poster (the clip's first frame) is in the page from the start, so there is no empty frame and no swap;
 * under reduced motion the clip is never loaded and the poster stays.
 */
export function ScrubVideo({ src, srcMobile, poster, posterMobile, label, className }: ScrubVideoProps) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  // No clip on the server or under reduced motion; on the client, the wide or portrait one for this screen.
  const clip = useSyncExternalStore(
    never,
    () => (window.matchMedia(REDUCED).matches ? null : window.matchMedia(WIDE).matches ? src : srcMobile),
    () => null,
  );

  useEffect(() => {
    const el = video.current;
    const section = root.current?.closest<HTMLElement>("[data-scrub-section]");
    if (!clip || !el || !section) return;
    let frame = 0;
    let played: number | null = null;
    // The playhead eases toward where the scroll is, a frame at a time, and waits out a seek that is still landing: a fast flick catches up smoothly instead of the clip skipping.
    const seek = () => {
      frame = 0;
      const target = videoTimeAt(sectionProgress(section.getBoundingClientRect(), window.innerHeight), el.duration);
      played = easeToward(played ?? el.currentTime, target, 0.2, 0.01);
      if (!el.seeking && Math.abs(el.currentTime - played) > 0.01) el.currentTime = played;
      if (played !== target) frame = requestAnimationFrame(seek);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(seek);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [clip]);

  return (
    <div ref={root} role="img" aria-label={label} className={cn("absolute inset-0 overflow-hidden", className)}>
      <picture>
        <source media={WIDE} srcSet={poster} />
        {/* A static first-frame poster: next/image cannot switch art by media query. */}
        <img src={posterMobile} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {clip && (
        <video
          ref={video}
          src={clip}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          onLoadedMetadata={() => setReady(true)}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}
