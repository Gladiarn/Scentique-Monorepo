import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SectionBoundary } from "./section-boundary";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

function Boom(): never {
  throw new Error("repository failed");
}

beforeEach(() => {
  refresh.mockClear();
  vi.spyOn(console, "error").mockImplementation(() => {}); // React logs caught render errors
});
afterEach(() => vi.restoreAllMocks());

describe("SectionBoundary", () => {
  it("renders its children when nothing fails", () => {
    render(<SectionBoundary label="best sellers"><p>All good</p></SectionBoundary>);
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("shows a clear error for just this section, naming what failed", () => {
    render(<SectionBoundary label="best sellers"><Boom /></SectionBoundary>);
    expect(screen.getByRole("alert")).toHaveTextContent(/could not load best sellers/i);
  });

  it("offers a retry that asks the router to reload the data", async () => {
    render(<SectionBoundary label="best sellers"><Boom /></SectionBoundary>);
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
