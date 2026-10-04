import { z } from "zod";

/** Test-mode card number. Nothing is charged; the form only checks the shape of what was typed. */
export const TEST_CARD = "4242 4242 4242 4242";

export const checkoutSchema = z.object({
  email: z.email("Enter an email address, like name@example.com"),
  fullName: z.string().trim().min(2, "Enter your full name"),
  line1: z.string().trim().min(4, "Enter a street address"),
  city: z.string().trim().min(2, "Enter a city"),
  postcode: z.string().trim().min(3, "Enter a postcode"),
  country: z.string().trim().min(2, "Enter a country"),
  delivery: z.enum(["standard", "express"], { error: "Choose a delivery option" }),
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{16}$/, `Enter the 16-digit test card, ${TEST_CARD}`)),
});

export type CheckoutValues = z.input<typeof checkoutSchema>;
