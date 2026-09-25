import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductImage } from "./product-image";

describe("ProductImage", () => {
  it("renders an accessible placeholder when no src is given", () => {
    render(<ProductImage family="oud" alt="Ember Oud bottle" />);
    expect(screen.getByRole("img", { name: "Ember Oud bottle" })).toBeInTheDocument();
  });

  it("renders the real image when src is provided", () => {
    render(<ProductImage family="oud" alt="Ember Oud bottle" src="/images/ember-oud.jpg" width={800} height={1000} />);
    expect(screen.getByAltText("Ember Oud bottle")).toBeInTheDocument();
  });

  it("serves SVG sources as-is instead of running the optimiser", () => {
    render(<ProductImage family="oud" alt="Traced bottle" src="/images/hero/traced.svg" width={800} height={450} />);
    expect(screen.getByAltText("Traced bottle")).toHaveAttribute("src", "/images/hero/traced.svg");
  });

  it("applies the requested object position so tall crops keep the bottle", () => {
    render(<ProductImage family="oud" alt="Cropped bottle" src="/images/hero/a.webp" width={800} height={450} objectPosition="62% 50%" />);
    expect(screen.getByAltText("Cropped bottle")).toHaveStyle({ objectPosition: "62% 50%" });
  });

  it("layers a backdrop photo under transparent artwork", () => {
    const { container } = render(
      <ProductImage family="oud" alt="Traced bottle" src="/images/hero/traced.svg" backdrop="/images/hero/silk-backdrop.webp" width={800} height={450} />,
    );
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "");
    expect(images[0]?.getAttribute("src")).toContain("silk-backdrop");
    expect(screen.getByAltText("Traced bottle")).toBeInTheDocument();
  });

  it("passes custom CSS variables through so a crop can change per breakpoint", () => {
    render(<ProductImage family="oud" alt="Var bottle" src="/images/hero/a.webp" width={800} height={450} style={{ "--pos-lg": "92% 50%" } as React.CSSProperties} />);
    expect((screen.getByAltText("Var bottle") as HTMLElement).style.getPropertyValue("--pos-lg")).toBe("92% 50%");
  });
});
