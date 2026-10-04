import { z } from "zod";
import type { Order } from "@scentique/shared";

export const ORDER_STEPS: Order["status"][] = ["pending", "paid", "packed", "shipped", "delivered"];

export const signInSchema = z.object({
  email: z.email("Enter an email address, like name@example.com"),
});

export const addressSchema = z.object({
  label: z.string().trim().min(1, "Give this address a name, like Home or Studio"),
  fullName: z.string().trim().min(2, "Enter the recipient's full name"),
  line1: z.string().trim().min(4, "Enter a street address"),
  city: z.string().trim().min(2, "Enter a city"),
  postcode: z.string().trim().min(3, "Enter a postcode"),
  country: z.string().trim().min(2, "Enter a country"),
});

export type AddressValues = z.input<typeof addressSchema>;

/** How far an order has progressed through the pipeline, as a count of completed steps. */
export function completedSteps(status: Order["status"]): number {
  return ORDER_STEPS.indexOf(status) + 1;
}
