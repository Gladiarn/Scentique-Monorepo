import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const created: { destroy: ReturnType<typeof vi.fn>; raf: ReturnType<typeof vi.fn>; options: unknown }[] = [];
vi.mock("lenis", () => ({
  default: class {
    destroy = vi.fn();
    raf = vi.fn();
    constructor(options: unknown) {
      created.push({ destroy: this.destroy, raf: this.raf, options });
    }
  },
}));

import { SmoothScroll } from "./smooth-scroll";

const motion = (reduced: boolean) =>
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }) });

beforeEach(() => {
  created.length = 0;
});

describe("SmoothScroll", () => {
  it("eases the wheel for visitors who have not asked for less motion, and lets go when it leaves", () => {
    motion(false);
    const { unmount } = render(<SmoothScroll />);
    expect(created).toHaveLength(1);
    unmount();
    expect(created[0]!.destroy).toHaveBeenCalledTimes(1);
  });

  it("leaves the browser's own scrolling alone under reduced motion", () => {
    motion(true);
    render(<SmoothScroll />);
    expect(created).toHaveLength(0);
  });
});
