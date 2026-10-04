"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OrderInput } from "@scentique/shared";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { orderRepository } from "@/data";
import { useCart } from "@/features/cart/cart-store";
import { lineTotalCents, shippingCents, subtotalCents, totalCents } from "@/features/cart/cart-logic";
import { useHydrated } from "@/features/cart/use-hydrated";
import { formatConcentration, formatMoney } from "@/lib/format";
import { TEST_CARD, checkoutSchema, type CheckoutValues } from "./checkout-schema";

const field = "h-11 w-full rounded-md border border-line bg-page px-3 text-sm text-ink focus:border-accent focus:outline-none aria-[invalid=true]:border-danger";
const label = "mb-2 block text-xs uppercase tracking-[0.16em] text-muted";
const error = "mt-2 text-sm text-danger";

export function CheckoutForm() {
  const ready = useHydrated();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { delivery: "standard", country: "United States" },
  });

  if (!ready) return <Skeleton className="h-[32rem] w-full" />;

  if (items.length === 0) {
    return (
      <GlassPanel className="max-w-md p-7">
        <p className="font-display text-2xl">Your bag is empty</p>
        <p className="mt-3 text-muted">Add a scent before checking out.</p>
        <Button href="/shop" className="mt-6">Browse the shelf</Button>
      </GlassPanel>
    );
  }

  const subtotal = subtotalCents(items);
  const shipping = shippingCents(subtotal);

  async function onSubmit(values: CheckoutValues) {
    setSubmitError(null);
    const parsed = checkoutSchema.parse(values);
    const input: OrderInput = {
      email: parsed.email,
      fullName: parsed.fullName,
      address: { line1: parsed.line1, city: parsed.city, postcode: parsed.postcode, country: parsed.country },
      delivery: parsed.delivery,
      lines: items.map((i) => ({
        variantId: i.variantId,
        productName: i.productName,
        sizeMl: i.sizeMl,
        concentration: i.concentration,
        quantity: i.quantity,
        unitPriceCents: i.unitPriceCents,
      })),
      totalCents: totalCents(items),
    };
    try {
      const order = await orderRepository.create(input);
      clear();
      router.push(`/checkout/confirmation?order=${order.id}`);
    } catch {
      setSubmitError("We could not place your order. Nothing was charged. Please try again.");
    }
  }

  const input = (name: keyof CheckoutValues) => ({
    ...register(name),
    id: name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const fieldError = (name: keyof CheckoutValues) =>
    errors[name] ? (
      <p id={`${name}-error`} className={error}>
        {errors[name]?.message}
      </p>
    ) : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-10" aria-label="Checkout">
        <fieldset className="space-y-5">
          <legend className="font-display text-2xl">Contact</legend>
          <div>
            <label htmlFor="email" className={label}>Email</label>
            <input type="email" className={field} autoComplete="email" {...input("email")} />
            {fieldError("email")}
          </div>
          <div>
            <label htmlFor="fullName" className={label}>Full name</label>
            <input className={field} autoComplete="name" {...input("fullName")} />
            {fieldError("fullName")}
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="font-display text-2xl">Delivery address</legend>
          <div>
            <label htmlFor="line1" className={label}>Street address</label>
            <input className={field} autoComplete="address-line1" {...input("line1")} />
            {fieldError("line1")}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className={label}>City</label>
              <input className={field} autoComplete="address-level2" {...input("city")} />
              {fieldError("city")}
            </div>
            <div>
              <label htmlFor="postcode" className={label}>Postcode</label>
              <input className={field} autoComplete="postal-code" {...input("postcode")} />
              {fieldError("postcode")}
            </div>
          </div>
          <div>
            <label htmlFor="country" className={label}>Country</label>
            <input className={field} autoComplete="country-name" {...input("country")} />
            {fieldError("country")}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-2xl">Delivery</legend>
          {[
            { value: "standard", label: "Standard", detail: "3 to 5 working days" },
            { value: "express", label: "Express", detail: "1 to 2 working days" },
          ].map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line px-5 py-4 has-[:checked]:border-accent">
              <span>
                <span className="block text-ink">{option.label}</span>
                <span className="text-sm text-muted">{option.detail}</span>
              </span>
              <input type="radio" value={option.value} className="accent-[var(--color-accent)]" {...register("delivery")} />
            </label>
          ))}
          {fieldError("delivery")}
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="font-display text-2xl">Payment</legend>
          <p className="text-sm text-muted">Test mode: no payment is taken. Use {TEST_CARD}.</p>
          <div>
            <label htmlFor="cardNumber" className={label}>Card number</label>
            <input inputMode="numeric" autoComplete="cc-number" className={field} {...input("cardNumber")} />
            {fieldError("cardNumber")}
          </div>
        </fieldset>

        {submitError && (
          <p role="alert" className="text-sm text-danger">{submitError}</p>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto sm:min-w-[14rem]">
          {isSubmitting ? "Placing order…" : `Place order · ${formatMoney(totalCents(items))}`}
        </Button>
      </form>

      <GlassPanel className="h-fit space-y-5 p-7">
        <h2 className="font-display text-2xl">Your order</h2>
        <ul className="space-y-4 text-sm">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between gap-4">
              <span>
                {item.productName}
                <span className="block text-muted">
                  {item.sizeMl} ml · {formatConcentration(item.concentration)} × {item.quantity}
                </span>
              </span>
              <span className="tabular-nums">{formatMoney(lineTotalCents(item))}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-ink/15 pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatMoney(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="tabular-nums">{shipping === 0 ? "Free" : formatMoney(shipping)}</dd></div>
          <div className="flex justify-between pt-2 text-base"><dt>Total</dt><dd className="font-display text-2xl tabular-nums">{formatMoney(totalCents(items))}</dd></div>
        </dl>
      </GlassPanel>
    </div>
  );
}
