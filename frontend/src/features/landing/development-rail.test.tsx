import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DevelopmentRail } from "./development-rail";

const notes = { top: ["Cinnamon bark", "Pink pepper"], heart: ["Frankincense", "Dried leaves"], base: ["Smoked woods", "Amber"] };

function media(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }) });
}
const renderIn = () => render(<section data-scrub-section=""><DevelopmentRail notes={notes} /></section>);
const scrollTo = (top: number) => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top, height: 2600 } as DOMRect);
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
};

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0; // synchronous in tests, so the id must stay falsy or the next scroll is ignored
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("DevelopmentRail", () => {
  it("lists the featured scent's real top, heart and base notes under an accessible name", () => {
    media(false);
    renderIn();
    const list = screen.getByRole("list", { name: /how the scent develops/i });
    expect(list.querySelectorAll("li")).toHaveLength(3);
    for (const [label, joined] of [["Top", "Cinnamon bark, Pink pepper"], ["Heart", "Frankincense, Dried leaves"], ["Base", "Smoked woods, Amber"]]) {
      expect(list).toHaveTextContent(label!);
      expect(list).toHaveTextContent(joined!);
    }
  });

  it("lights one tier at a time as the section scrolls: top, then heart, then base", () => {
    media(false);
    const { container } = renderIn();
    const active = () => [...container.querySelectorAll("li[data-active=true]")].map((li) => li.getAttribute("data-tier"));
    expect(active()).toEqual(["top"]);
    scrollTo(-800); // 800 / (2600 - 768) = 0.44
    expect(active()).toEqual(["heart"]);
    scrollTo(-1800);
    expect(active()).toEqual(["base"]);
  });

  it("is a plain static list under reduced motion: every tier readable at full strength", () => {
    media(true);
    const { container } = renderIn();
    expect(container.querySelectorAll("li[data-active=true]")).toHaveLength(3);
  });
});
