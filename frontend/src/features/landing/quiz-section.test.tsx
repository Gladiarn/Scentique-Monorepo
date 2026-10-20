import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { productFixtures } from "@/data/mock/fixtures/products";
import { QuizSection } from "./quiz-section";

const setup = () => render(<QuizSection products={productFixtures} />);
const answerAll = async () => {
  for (const answer of [/oud/i, /evening/i, /unisex/i, /intense/i]) await userEvent.click(screen.getByRole("button", { name: answer }));
};

describe("QuizSection", () => {
  it("is the #quiz landmark, asking one question at a time with its progress", async () => {
    const { container } = setup();
    expect(container.querySelector("section")).toHaveAttribute("id", "quiz");
    expect(screen.getByText(/question 1 of 4/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /quiz progress/i })).toHaveAttribute("aria-valuenow", "0");
    await userEvent.click(screen.getByRole("button", { name: /woody/i }));
    expect(screen.getByText(/question 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /quiz progress/i })).toHaveAttribute("aria-valuenow", "25");
  });

  it("goes back a step without losing the earlier answers", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: /woody/i }));
    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByText(/question 1 of 4/i)).toBeInTheDocument();
  });

  it("ends on two or three scents to try, each a link to its page, and a way to start again", async () => {
    setup();
    await answerAll();
    expect(screen.getByRole("heading", { level: 2, name: /two or three scents to try/i })).toBeInTheDocument();
    const picks = screen.getAllByRole("listitem");
    expect(picks.length).toBeGreaterThanOrEqual(2);
    expect(picks.length).toBeLessThanOrEqual(3);
    for (const li of picks) expect(li.querySelector("a")?.getAttribute("href")).toMatch(/^\/product\//);
    expect(screen.getByRole("button", { name: /retake/i })).toBeInTheDocument();
  });

  it("retake returns to the first question", async () => {
    setup();
    await answerAll();
    await userEvent.click(screen.getByRole("button", { name: /retake/i }));
    expect(screen.getByText(/question 1 of 4/i)).toBeInTheDocument();
  });
});
