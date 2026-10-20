"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useSectionProgress } from "@/lib/use-section-progress";

/** Where the scroll counts as having reached the peak of the push-in. */
const PEAK_FROM = 0.72;

/**
 * The one call to action at the climax of the hero. It is invisible, unclickable, unfocusable and hidden from assistive
 * tech until the scroll reaches the peak, so it can never sit unseen over another button. Not rendered under reduced
 * motion, where the hero is a still and carries its own button.
 */
export function PeakCta({ href, children }: { href: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  useSectionProgress(ref, (progress) => setVisible(progress >= PEAK_FROM), !reduced);
  if (reduced) return null;

  return (
    <div
      ref={ref}
      data-visible={visible}
      aria-hidden={visible ? undefined : true}
      className={cn("transition-opacity duration-700 ease-out-quart", visible ? "opacity-100" : "pointer-events-none opacity-0")}
    >
      <Button href={href} tabIndex={visible ? undefined : -1}>
        {children}
      </Button>
    </div>
  );
}
