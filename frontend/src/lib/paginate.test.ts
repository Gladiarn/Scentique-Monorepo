import { describe, expect, it } from "vitest";
import { clampPage, pageCount, pageSlice } from "./paginate";

describe("pageCount", () => {
  it("rounds up and is never zero", () => {
    expect(pageCount(200, 25)).toBe(8);
    expect(pageCount(201, 25)).toBe(9);
    expect(pageCount(0, 25)).toBe(1);
  });
});

describe("clampPage", () => {
  it("keeps the page inside the range", () => {
    expect(clampPage(0, 4)).toBe(1);
    expect(clampPage(9, 4)).toBe(4);
    expect(clampPage(NaN, 4)).toBe(1);
  });
});

describe("pageSlice", () => {
  const items = Array.from({ length: 200 }, (_, i) => i);

  it("returns the requested page", () => {
    const result = pageSlice(items, 2, 25);
    expect(result.items[0]).toBe(25);
    expect(result.items).toHaveLength(25);
    expect(result.count).toBe(8);
  });

  it("returns a short last page", () => {
    expect(pageSlice(items, 8, 25).items).toHaveLength(25);
    expect(pageSlice(Array.from({ length: 30 }), 2, 25).items).toHaveLength(5);
  });

  it("clamps an out-of-range page", () => {
    expect(pageSlice(items, 99, 25).page).toBe(8);
  });
});
