import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { About } from "./about";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});

describe("About (how it is made)", () => {
  it("is the #about landmark, named by its heading, on a warm umber surface", () => {
    const { container } = render(<About />);
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("id", "about");
    expect(section.className).toContain("surface-umber");
    expect(screen.getByRole("region", { name: /a small house with a long process/i })).toBe(section);
  });

  it("tells the process in order, in the house's own words", () => {
    render(<About />);
    const steps = screen.getAllByRole("listitem");
    expect(steps.map((li) => li.querySelector("p")?.textContent)).toEqual(["Blended by hand", "Rested for six weeks", "Bottled in small runs"]);
    expect(screen.getByText(/we make fewer scents than we could/i)).toBeInTheDocument();
  });

  it("shows real photography with descriptive alt text, wiped open and drifting at different depths", () => {
    const { container } = render(<About />);
    const imgs = screen.getAllByRole("img");
    expect(imgs.length).toBeGreaterThanOrEqual(3);
    for (const img of imgs) expect(img.getAttribute("alt")?.length).toBeGreaterThan(8);
    expect(container.querySelector("[data-reveal]")).toBeInTheDocument();
    expect(new Set([...container.querySelectorAll("[data-depth]")].map((el) => el.getAttribute("data-depth"))).size).toBeGreaterThan(1);
  });
});
