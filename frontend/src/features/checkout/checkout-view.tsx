"use client";

import { useState, type FormEvent } from "react";
import { Button, glassButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { formatConcentration, formatMoney } from "@/lib/format";
import { lineTotalCents, subtotalCents, type CartItem } from "../cart/cart-logic";
import { useCart } from "../cart/cart-store";
import { useHydrated } from "../cart/use-hydrated";
import { deliveryCents, EXPRESS_SHIPPING_CENTS } from "./checkout-logic";
import { checkoutSchema, TEST_CARD, type CheckoutValues } from "./checkout-schema";

const EMPTY: CartItem[] = [];

/** Stands in for creating an order until there is a backend: it waits a moment and succeeds. Nothing is sent or charged. */
const placeholderPlaceOrder = (): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, 600));

type Field = Exclude<keyof CheckoutValues, "delivery">;
type Errors = Partial<Record<keyof CheckoutValues, string>>;
type Status = "idle" | "sending" | "failed" | "placed";

const FIELDS: { name: Field; label: string; autoComplete: string; hint?: string; inputMode?: "email" | "numeric" }[] = [
  { name: "email", label: "Email", autoComplete: "email", inputMode: "email" },
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "line1", label: "Street address", autoComplete: "address-line1" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postcode", label: "Postcode", autoComplete: "postal-code" },
  { name: "country", label: "Country", autoComplete: "country-name" },
  { name: "cardNumber", label: "Card number", autoComplete: "off", hint: `Test mode: use ${TEST_CARD}. Nothing is charged.`, inputMode: "numeric" },
];

const input =
  "mt-2 h-12 w-full rounded-lg border border-ink/25 bg-surface/45 px-4 text-ink backdrop-blur-glass transition-colors duration-150 placeholder:text-muted focus-visible:border-accent aria-[invalid=true]:border-danger";

/** Checkout: contact, delivery, a test card and the order summary. Validates every field at once, names each problem, keeps what was typed. */
export function CheckoutView({ placeOrder = placeholderPlaceOrder }: { placeOrder?: () => Promise<void> }) {
  const hydrated = useHydrated();
  const items = useCart((s) => (hydrated ? s.items : EMPTY));
  const [delivery, setDelivery] = useState<CheckoutValues["delivery"]>("standard");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [paid, setPaid] = useState(0);

  if (status === "placed") {
    return (
      <Container className="pb-32">
        <h2 className="font-display text-3xl">Thank you</h2>
        <p className="mt-4 max-w-[56ch] text-lg text-ink/80">
          Your order of {formatMoney(paid)} is in. This is test mode: no card was charged and no confirmation email was sent.
        </p>
        <Button href="/shop" className="mt-8">
          Keep shopping
        </Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="pb-32">
        <p className="text-lg text-ink/80">Your bag is empty.</p>
        <Button href="/shop" className="mt-8">
          Shop all perfumes
        </Button>
      </Container>
    );
  }

  const subtotal = subtotalCents(items);
  const shipping = deliveryCents(subtotal, delivery);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const parsed = checkoutSchema.safeParse({ ...data, delivery });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof CheckoutValues;
        next[key] ??= issue.message;
      }
      setErrors(next);
      setStatus("idle");
      event.currentTarget.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      await placeOrder();
      setPaid(subtotal + shipping);
      useCart.getState().clear();
      setStatus("placed");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <Container className="grid gap-12 pb-32 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
      <form noValidate onSubmit={submit} className="space-y-8">
        {FIELDS.map(({ name, label, autoComplete, hint, inputMode }) => (
          <div key={name}>
            <label htmlFor={name} className="text-sm text-muted">
              {label}
            </label>
            <input
              id={name}
              name={name}
              autoComplete={autoComplete}
              inputMode={inputMode}
              aria-invalid={errors[name] ? true : undefined}
              aria-describedby={`${name}-note`}
              className={input}
            />
            <p id={`${name}-note`} className={cn("mt-2 text-sm", errors[name] ? "text-danger" : "text-muted")}>
              {errors[name] ?? hint}
            </p>
          </div>
        ))}

        <fieldset>
          <legend className="mb-3 text-sm text-muted">Delivery</legend>
          <div className="flex flex-wrap gap-2.5">
            {(
              [
                ["standard", `Standard · ${shippingLabel(deliveryCents(subtotal, "standard"))}`],
                ["express", `Express · ${formatMoney(EXPRESS_SHIPPING_CENTS)}`],
              ] as const
            ).map(([value, text]) => (
              <label key={value}>
                <input type="radio" name="delivery" className="peer sr-only" checked={delivery === value} onChange={() => setDelivery(value)} />
                <span className="inline-flex h-11 cursor-pointer items-center rounded-pill border border-ink/25 px-5 text-sm text-ink/85 press peer-checked:border-accent peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-ink/60">
                  {text}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <button type="submit" disabled={status === "sending"} className={cn(glassButton, "w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50")}>
            {status === "sending" ? "Placing order…" : "Place order"}
          </button>
          <div className="mt-4 min-h-6 text-sm">
            {status === "failed" && (
              <p role="alert" className="text-danger">
                We could not place your order. Nothing was charged and your bag is kept; try again.
              </p>
            )}
          </div>
        </div>
      </form>

      <section aria-labelledby="summary-heading" className="h-fit rounded-xl border border-ink/15 bg-surface/45 p-7 backdrop-blur-glass lg:sticky lg:top-28">
        <h2 id="summary-heading" className="font-display text-2xl">
          Order summary
        </h2>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between gap-4">
              <div>
                <span className="block">{item.productName}</span>
                <span className="text-sm text-muted">
                  {item.sizeMl} ml · {formatConcentration(item.concentration)} · ×{item.quantity}
                </span>
              </div>
              <span>{formatMoney(lineTotalCents(item))}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-3 border-t border-ink/15 pt-6 text-ink/90">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{shippingLabel(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-ink/15 pt-4 text-lg text-ink">
            <dt>Total</dt>
            <dd>{formatMoney(subtotal + shipping)}</dd>
          </div>
        </dl>
      </section>
    </Container>
  );
}

const shippingLabel = (cents: number) => (cents === 0 ? "Free" : formatMoney(cents));
