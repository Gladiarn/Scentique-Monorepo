import { describe, expect, it } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  it("formats integer cents as USD", () => {
    expect(formatMoney(12800)).toBe("$128.00");
  });
  it("handles zero", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });
});
