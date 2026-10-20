import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Seam } from "./seam";

describe("Seam", () => {
  it("is decoration only: hidden from assistive tech and never takes a click", () => {
    const { container } = render(<Seam shape="swell" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.className).toContain("pointer-events-none");
  });

  it("draws three fills and a hairline along the crest", () => {
    const { container } = render(<Seam shape="tide" />);
    expect(container.querySelectorAll("path[data-layer='fill']")).toHaveLength(3);
    expect(container.querySelectorAll("path[data-layer='rim']").length).toBeGreaterThanOrEqual(1);
  });

  it("gives two seams on one page different gradient ids, so they cannot borrow each other's colours", () => {
    const { container } = render(
      <>
        <Seam shape="swell" />
        <Seam shape="swell" />
      </>,
    );
    const ids = [...container.querySelectorAll("linearGradient")].map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mirrors the line when flipped, so a repeated shape does not read as a repeat", () => {
    const { container } = render(<Seam shape="ridge" flip />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("-scale-x-100");
  });
});
