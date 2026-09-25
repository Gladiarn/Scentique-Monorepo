import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CollectionsSection } from "./collections";

describe("CollectionsSection (bento)", () => {
  it("links every scent family to its shop filter", async () => {
    render(await CollectionsSection());
    for (const family of ["woody", "floral", "citrus", "oud"]) {
      expect(document.querySelector(`a[href="/shop?family=${family}"]`)).toBeInTheDocument();
    }
  });

  it("includes a tile that leads to the scent quiz", async () => {
    render(await CollectionsSection());
    expect(screen.getByRole("link", { name: /find your scent/i })).toHaveAttribute("href", "/quiz");
  });
});
