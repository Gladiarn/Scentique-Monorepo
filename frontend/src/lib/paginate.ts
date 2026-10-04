export function pageCount(total: number, size: number): number {
  return Math.max(1, Math.ceil(total / size));
}

/** Clamps a requested page into range, so a stale or hand-edited page number still shows something. */
export function clampPage(page: number, count: number): number {
  if (!Number.isFinite(page)) return 1;
  return Math.min(count, Math.max(1, Math.floor(page)));
}

export function pageSlice<T>(items: T[], page: number, size: number): { items: T[]; page: number; count: number } {
  const count = pageCount(items.length, size);
  const current = clampPage(page, count);
  const start = (current - 1) * size;
  return { items: items.slice(start, start + size), page: current, count };
}
