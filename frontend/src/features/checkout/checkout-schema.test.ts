import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./checkout-schema";

const valid = {
  email: "guest@example.com",
  fullName: "Ada Lovelace",
  line1: "12 Rose Street",
  city: "London",
  postcode: "E1 6AN",
  country: "United Kingdom",
  delivery: "standard",
  cardNumber: "4242 4242 4242 4242",
} as const;

describe("checkoutSchema", () => {
  it("accepts a complete form and normalises the card number", () => {
    const result = checkoutSchema.parse(valid);
    expect(result.cardNumber).toBe("4242424242424242");
  });

  it("reports the field that is wrong", () => {
    const result = checkoutSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.path[0])).toContain("email");
  });

  it("rejects a card number that is not 16 digits", () => {
    expect(checkoutSchema.safeParse({ ...valid, cardNumber: "4242" }).success).toBe(false);
  });

  it("rejects an unknown delivery option", () => {
    expect(checkoutSchema.safeParse({ ...valid, delivery: "drone" }).success).toBe(false);
  });
});
