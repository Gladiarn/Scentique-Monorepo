import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WaveBackdrop } from "./wave-backdrop";

function layerFills(container: HTMLElement, edge: "bottom" | "top" = "bottom"): string[] {
  return Array.from(container.querySelectorAll(`[data-edge="${edge}"] svg path`))
    .map((p) => p.getAttribute("fill") ?? "")
    .filter((fill) => fill && fill !== "none");
}

/** Share of the lighter brown (--color-woody) mixed in; 0 for the plain page colour. */
function lightness(fill: string): number {
  if (fill === "var(--color-page)") return 0;
  const m = fill.match(/var\(--color-woody\)\s+(\d+)%/);
  return m ? Number(m[1]) : Number.NaN;
}

describe("WaveBackdrop", () => {
  it("is decorative and hidden from assistive tech", () => {
    const { container } = render(<WaveBackdrop />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("has at least four waves", () => {
    const { container } = render(<WaveBackdrop />);
    expect(layerFills(container).length).toBeGreaterThanOrEqual(4);
  });

  it("the front wave matches the page background so it flows into what follows", () => {
    const { container } = render(<WaveBackdrop />);
    const fills = layerFills(container);
    expect(fills[fills.length - 1]).toBe("var(--color-page)");
  });

  it("each wave behind the front one is a lighter brown than the wave in front of it", () => {
    const { container } = render(<WaveBackdrop />);
    const values = layerFills(container).map(lightness);
    expect(values.every((v) => !Number.isNaN(v))).toBe(true);
    for (let i = 1; i < values.length; i++) expect(values[i - 1]!).toBeGreaterThan(values[i]!);
  });

  it("uses only browns for the waves and the sky", () => {
    const { container } = render(<WaveBackdrop />);
    const all = [...layerFills(container, "bottom"), ...layerFills(container, "top")];
    for (const fill of all) expect(fill).toMatch(/^var\(--color-page\)$|--color-woody\)\s+\d+%/);
    expect((container.firstElementChild as HTMLElement).style.background).not.toMatch(/--color-(oud|accent|floral|citrus)/);
  });

  it("mirrors the waves onto the top edge, with the page colour outermost so it blends into the section above", () => {
    const { container } = render(<WaveBackdrop />);
    const fills = layerFills(container, "top");
    expect(fills.length).toBeGreaterThanOrEqual(4);
    expect(fills[fills.length - 1]).toBe("var(--color-page)");
    const values = fills.map(lightness);
    for (let i = 1; i < values.length; i++) expect(values[i - 1]!).toBeGreaterThan(values[i]!);
  });

  it("has no lines or borders: every path is a filled wave, and the accent colour is not used at all", () => {
    const { container } = render(<WaveBackdrop />);
    const paths = Array.from(container.querySelectorAll("path"));
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) {
      expect(p.getAttribute("fill")).not.toBe("none");
      expect(p.getAttribute("stroke")).toBeNull();
    }
    expect(container.innerHTML).not.toContain("--color-accent");
  });

  it("bleeds its wave zones 1px past the section edges so no hairline seam shows", () => {
    const { container } = render(<WaveBackdrop />);
    expect(container.querySelector('[data-edge="top"]')?.className).toContain("-top-px");
    expect(container.querySelector('[data-edge="bottom"]')?.className).toContain("-bottom-px");
  });
});
