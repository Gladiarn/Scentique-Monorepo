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
});
