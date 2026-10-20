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
