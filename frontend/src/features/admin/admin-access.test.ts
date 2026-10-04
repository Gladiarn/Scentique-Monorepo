import { describe, expect, it } from "vitest";
import { isAccessCodeValid } from "./admin-access";

describe("isAccessCodeValid", () => {
  it("accepts the code with surrounding spaces ignored", () => {
    expect(isAccessCodeValid("  scentique-staff ")).toBe(true);
  });

  it("rejects anything else, including a near miss", () => {
    expect(isAccessCodeValid("scentique")).toBe(false);
    expect(isAccessCodeValid("")).toBe(false);
  });
});
