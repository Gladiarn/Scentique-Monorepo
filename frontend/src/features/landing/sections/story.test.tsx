import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StorySection } from "./story";

describe("StorySection (bento)", () => {
  it("has the section heading and anchors the #craft link", () => {
    const { container } = render(<StorySection />);
    expect(screen.getByRole("heading", { level: 2, name: /long process/i })).toBeInTheDocument();
    expect(container.querySelector("#craft")).toBeInTheDocument();
  });

  it("shows real ingredient photography with descriptive alt text", () => {
    render(<StorySection />);
    const photos = screen.getAllByRole("img").filter((el) => el.getAttribute("src")?.includes("ingredients"));
    expect(photos.length).toBeGreaterThanOrEqual(3);
    for (const img of photos) expect(img.getAttribute("alt")?.length).toBeGreaterThan(8);
  });

  it("lists the three steps of the process", () => {
    render(<StorySection />);
    expect(screen.getByText(/blended by hand/i)).toBeInTheDocument();
    expect(screen.getByText(/rested/i)).toBeInTheDocument();
    expect(screen.getByText(/bottled/i)).toBeInTheDocument();
  });

  it("renders the process card as glass", () => {
    render(<StorySection />);
    expect(screen.getByRole("heading", { level: 3, name: /how it is made/i }).closest(".backdrop-blur-glass")).not.toBeNull();
  });
});
