import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Em } from "./em";

describe("Em", () => {
  it("renders the highlighted words in the accent italic font and accent colour", () => {
    render(<h1>Made from <Em>rare ingredients</Em></h1>);
    const el = screen.getByText("rare ingredients");
    expect(el.tagName).toBe("EM");
    expect(el.className).toContain("font-accent");
    expect(el.className).toContain("text-accent");
    expect(el.className).toContain("italic");
  });
});
