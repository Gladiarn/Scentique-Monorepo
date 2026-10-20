"use client";

import { useSyncExternalStore } from "react";

const never = () => () => {};

/** True when the visitor asked for less motion. False on the server, so server HTML is the full experience. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(never, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
}
