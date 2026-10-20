import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./reveal";

type IOCallback = (entries: { isIntersecting: boolean }[]) => void;
let trigger: IOCallback | null = null;

function installIO() {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IOCallback) {
        trigger = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
}
const reduced = (reduce: boolean) =>
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: reduce && q.includes("reduce") }) });
const below = () => vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: window.innerHeight + 200, bottom: window.innerHeight + 400, height: 200 } as DOMRect);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  trigger = null;
});

describe("Reveal", () => {
  it("renders visible when IntersectionObserver is missing, so nothing is lost without JavaScript APIs", () => {
    reduced(false);
    const { container } = render(<Reveal>hi</Reveal>);
    expect(container.firstElementChild).toHaveAttribute("data-reveal", "static");
  });

  it("leaves content already on screen alone, so nothing above the fold flashes", () => {
    reduced(false);
    installIO();
    const { container } = render(<Reveal>hi</Reveal>);
    expect(container.firstElementChild).toHaveAttribute("data-reveal", "static");
  });

  it("hides content below the fold and rises it in when it intersects", () => {
    reduced(false);
    installIO();
    below();
    const { container } = render(<Reveal>hi</Reveal>);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("data-reveal", "hidden");
    expect(el.className).toContain("opacity-0");
    act(() => trigger!([{ isIntersecting: true }]));
    expect(el).toHaveAttribute("data-reveal", "shown");
    expect(el.className).not.toContain("opacity-0");
  });

  it("wipes a photograph open with a clip-path instead of fading it", () => {
    reduced(false);
    installIO();
    below();
    const { container } = render(<Reveal variant="wipe">img</Reveal>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("clip-path");
    expect(el.className).not.toContain("opacity-0");
    act(() => trigger!([{ isIntersecting: true }]));
    expect(el.className).toContain("inset(0)");
  });

  it("never hides anything under reduced motion", () => {
    reduced(true);
    installIO();
    below();
    const { container } = render(<Reveal variant="wipe">img</Reveal>);
    expect(container.firstElementChild).toHaveAttribute("data-reveal", "static");
  });
});
