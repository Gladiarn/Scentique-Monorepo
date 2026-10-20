import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testimonialFixtures } from "@/data/mock/fixtures/testimonials";

const repo = vi.hoisted(() => ({ findAll: vi.fn() }));
vi.mock("@/data", () => ({ testimonialRepository: repo }));

import { Reviews } from "./reviews";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  repo.findAll.mockResolvedValue(testimonialFixtures);
});

describe("Reviews (proof, drifting)", () => {
  it("is the #reviews landmark with each quote, its author and place, and the placeholder note kept", async () => {
    const { container } = render(await Reviews());
    expect(container.querySelector("section")).toHaveAttribute("id", "reviews");
    expect(screen.getAllByRole("blockquote")).toHaveLength(testimonialFixtures.length);
    expect(screen.getByText(`${testimonialFixtures[0]!.author}, ${testimonialFixtures[0]!.location}`)).toBeInTheDocument();
    expect(screen.getByText("Placeholder reviews for design purposes.")).toBeInTheDocument();
  });

  it("drifts: the quotes sit at different depths", async () => {
    const { container } = render(await Reviews());
    const depths = [...container.querySelectorAll("[data-depth]")].map((el) => el.getAttribute("data-depth"));
    expect(new Set(depths).size).toBeGreaterThan(1);
  });

  it("renders nothing without reviews", async () => {
    repo.findAll.mockResolvedValue([]);
    expect(await Reviews()).toBeNull();
  });
});
