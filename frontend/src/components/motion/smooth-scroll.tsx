"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Eases the mouse wheel, so a fast flick glides instead of jumping by whole notches and every scroll-driven scene has
 * time to draw each frame. Touch keeps the phone's own momentum. Under reduced motion the browser scrolls as normal.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    let frame = requestAnimationFrame(function tick(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
