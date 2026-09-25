import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./hero";

describe("HeroSection", () => {
  it("features Bois Fumé Précieux", async () => {
    render(await HeroSection());
    expect(screen.getByTestId("hero-scent-name").textContent).toBe("Bois Fumé Précieux");
  });

  it("has no waving banner behind it (that belongs to the closing section)", async () => {
    const { container } = render(await HeroSection());
    expect(container.querySelector("svg.animate-wave-drift")).toBeNull();
  });
});
