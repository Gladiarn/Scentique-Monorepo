import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotFoundContent } from "./not-found-content";

describe("NotFoundContent", () => {
  it("says the page could not be found", () => {
    render(<NotFoundContent />);
    expect(screen.getByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });

  it("offers a way back to shopping and home", () => {
    render(<NotFoundContent />);
    expect(screen.getByRole("link", { name: /shop all scents/i })).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
  });
});
