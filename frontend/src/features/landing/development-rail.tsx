"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { noteTierAt, type NoteTier } from "@/lib/scrub";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useSectionProgress } from "@/lib/use-section-progress";

interface Notes {
  top: string[];
  heart: string[];
  base: string[];
}

const TIERS: { key: NoteTier; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "heart", label: "Heart" },
  { key: "base", label: "Base" },
];

/**
 * A perfume develops over time: top notes first, then the heart, then the base. Scroll is time here, so the featured
 * scent's own notes light in turn as the camera pushes into the bottle. Under reduced motion all three simply read.
 */
export function DevelopmentRail({ notes, className }: { notes: Notes; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const [tier, setTier] = useState<NoteTier>("top");
  useSectionProgress(ref, (progress) => setTier(noteTierAt(progress)), !reduced);

  return (
    <ul ref={ref} aria-label="How the scent develops" className={cn("space-y-6", className)}>
      {TIERS.map(({ key, label }) => {
        const active = reduced || tier === key;
        return (
          <li
            key={key}
            data-tier={key}
            data-active={active}
            className={cn("max-w-[15rem] text-right transition-opacity duration-700 ease-out-quart", active ? "opacity-100" : "opacity-55")}
          >
            <p className="text-xs text-accent">{label}</p>
            <p className="mt-1 text-sm text-ink">{notes[key].join(", ")}</p>
          </li>
        );
      })}
    </ul>
  );
}
