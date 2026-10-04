import { describe, expect, it } from "vitest";
import { addressSchema, completedSteps, signInSchema } from "./account-logic";

describe("signInSchema", () => {
  it("accepts a plain email and rejects anything else", () => {
    expect(signInSchema.safeParse({ email: "ada@example.com" }).success).toBe(true);
    expect(signInSchema.safeParse({ email: "ada" }).success).toBe(false);
  });
});

describe("addressSchema", () => {
  const valid = { label: "Home", fullName: "Ada Lovelace", line1: "12 Rose Street", city: "London", postcode: "E1 6AN", country: "United Kingdom" };

  it("accepts a complete address", () => {
    expect(addressSchema.safeParse(valid).success).toBe(true);
  });

  it("names the field that is missing", () => {
    const result = addressSchema.safeParse({ ...valid, label: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("label");
  });
});

describe("completedSteps", () => {
  it("counts progress through the pipeline", () => {
    expect(completedSteps("pending")).toBe(1);
    expect(completedSteps("shipped")).toBe(4);
    expect(completedSteps("delivered")).toBe(5);
  });
});
