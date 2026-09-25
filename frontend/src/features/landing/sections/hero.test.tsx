import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./hero";

describe("HeroSection", () => {
  it("opens on Ambre Fumé, the first featured scent", async () => {
    render(await HeroSection());
    expect(screen.getByTestId("current-name").textContent).toBe("Ambre Fumé");
  });

  it("only offers scents that have hero artwork", async () => {
    render(await HeroSection());
    expect(screen.getByText("1 of 4: Ambre Fumé")).toBeInTheDocument();
  });

  it("has no waving banner behind it (that belongs to the closing section)", async () => {
    const { container } = render(await HeroSection());
    expect(container.querySelector("svg.animate-wave-drift")).toBeNull();
  });
});
