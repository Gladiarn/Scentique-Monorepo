import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BestSellersSection } from "./best-sellers";

describe("BestSellersSection (bento)", () => {
  it("leads with a featured scent that shows its notes pyramid", async () => {
    render(await BestSellersSection());
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Heart")).toBeInTheDocument();
    expect(screen.getByText("Base")).toBeInTheDocument();
  });

  it("links every scent to its product page", async () => {
    render(await BestSellersSection());
    const links = Array.from(document.querySelectorAll('a[href^="/product/"]'));
    expect(links.length).toBeGreaterThanOrEqual(4);
  });
});
