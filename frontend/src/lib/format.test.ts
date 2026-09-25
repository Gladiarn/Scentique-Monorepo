import { describe, expect, it } from "vitest";
import { formatConcentration, formatMoney } from "./format";

describe("formatMoney", () => {
  it("formats integer cents as USD", () => {
    expect(formatMoney(12800)).toBe("$128.00");
  });
  it("handles zero", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });
});

describe("formatConcentration", () => {
  it("names each concentration for customers", () => {
    expect(formatConcentration("extrait")).toBe("Extrait de Parfum");
    expect(formatConcentration("eau_de_parfum")).toBe("Eau de Parfum");
    expect(formatConcentration("eau_de_toilette")).toBe("Eau de Toilette");
  });
});
