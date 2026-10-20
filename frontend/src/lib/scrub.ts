const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** How far a tall section has scrolled: 0 until its top reaches the viewport top, 1 when its bottom meets the viewport bottom. */
export function sectionProgress(rect: { top: number; height: number }, viewportHeight: number): number {
  const travel = rect.height - viewportHeight;
  return travel > 0 ? clamp01(-rect.top / travel) : 0;
}

/** Where to seek a clip for a scroll progress. Stops just short of the end, so the last frame stays on screen. */
export function videoTimeAt(progress: number, duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return Math.min(clamp01(progress) * duration, Math.max(0, duration - 0.04));
}

export type NoteTier = "top" | "heart" | "base";

/** A perfume unfolds top, then heart, then base. Scroll is time: each tier owns a third of the scroll. */
export function noteTierAt(progress: number): NoteTier {
  const p = Number.isFinite(progress) ? clamp01(progress) : 0;
  return p < 1 / 3 ? "top" : p < 2 / 3 ? "heart" : "base";
}

/**
 * How far a section has come into view (`enter`: 0 as its top leaves the viewport bottom, 1 once its top reaches the
 * viewport top) and how far it has left (`exit`: 0 while its bottom is below the viewport, 1 once it is gone).
 * Sections use these to dissolve into their neighbours instead of meeting them on a hard edge.
 */
export function sectionEdges(rect: { top: number; bottom: number }, viewportHeight: number): { enter: number; exit: number } {
  if (!(viewportHeight > 0)) return { enter: 0, exit: 0 };
  return { enter: clamp01((viewportHeight - rect.top) / viewportHeight), exit: clamp01((viewportHeight - rect.bottom) / viewportHeight) };
}


/** One frame of easing: close `rate` of the gap to `target`, snapping onto it once within `epsilon` so a loop can stop. */
export function easeToward(current: number, target: number, rate: number, epsilon = 0.001): number {
  const next = current + (target - current) * rate;
  return Math.abs(target - next) <= epsilon ? target : next;
}
