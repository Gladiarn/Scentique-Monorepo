import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NewsletterForm } from "./newsletter-form";

describe("NewsletterForm", () => {
  it("asks for an email with a visible label and a subscribe button", () => {
    render(<NewsletterForm />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
  });

  it("names the problem, and how to fix it, for an email that is not one, and does not subscribe", async () => {
    const subscribe = vi.fn().mockResolvedValue(undefined);
    render(<NewsletterForm subscribe={subscribe} />);
    await userEvent.type(screen.getByLabelText(/email/i), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/enter an email like name@example\.com/i);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-invalid", "true");
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("subscribes a valid email and confirms with the same words the button used", async () => {
    const subscribe = vi.fn().mockResolvedValue(undefined);
    render(<NewsletterForm subscribe={subscribe} />);
    await userEvent.type(screen.getByLabelText(/email/i), "ana@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(subscribe).toHaveBeenCalledWith("ana@example.com");
    expect(await screen.findByRole("status")).toHaveTextContent(/subscribed/i);
  });

  it("says what went wrong, and keeps the email, when subscribing fails", async () => {
    const subscribe = vi.fn().mockRejectedValue(new Error("down"));
    render(<NewsletterForm subscribe={subscribe} />);
    await userEvent.type(screen.getByLabelText(/email/i), "ana@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not subscribe/i);
    expect(screen.getByLabelText(/email/i)).toHaveValue("ana@example.com");
  });
});
