"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type State = "static" | "hidden" | "shown";

/**
 * Brings its content in the first time it scrolls into view: it rises and fades, or (`wipe`, for photographs) opens
 * top to bottom with a clip-path. Server HTML is fully visible ("static"); only content that starts below the fold is
 * hidden after mount, so nothing flashes and nothing is lost without JavaScript or under reduced motion.
 */
export function Reveal({ variant = "rise", delay = 0, className, children }: { variant?: "rise" | "wipe"; delay?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setState("shown");
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const wipe = variant === "wipe";
  return (
    <div
      ref={ref}
      data-reveal={state}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        wipe ? "transition-[clip-path] duration-[900ms]" : "transition-[opacity,translate] duration-700",
        "ease-out-quart motion-reduce:transition-none",
        wipe ? (state === "hidden" ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0)]") : state === "hidden" && "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
