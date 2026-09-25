import { describe, expect, it } from "vitest";
import { failureRateFromEnv, simulate } from "./simulate";

describe("failureRateFromEnv", () => {
  it("is off by default", () => {
    expect(failureRateFromEnv(undefined)).toBe(0);
    expect(failureRateFromEnv("")).toBe(0);
  });
  it("reads a rate between 0 and 1", () => {
    expect(failureRateFromEnv("0.25")).toBe(0.25);
    expect(failureRateFromEnv("1")).toBe(1);
  });
  it("ignores nonsense and clamps out-of-range values", () => {
    expect(failureRateFromEnv("abc")).toBe(0);
    expect(failureRateFromEnv("-3")).toBe(0);
    expect(failureRateFromEnv("7")).toBe(1);
  });
});

describe("simulate", () => {
  it("rejects when the failure rate is 1, so error states can be exercised", async () => {
    await expect(simulate("x", { latencyMs: 0, failureRate: 1 })).rejects.toThrow("Mock request failed");
  });
  it("resolves the value when the failure rate is 0", async () => {
    await expect(simulate("x", { latencyMs: 0, failureRate: 0 })).resolves.toBe("x");
  });
});
