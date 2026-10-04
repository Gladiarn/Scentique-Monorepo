"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { customerRepository } from "@/data";
import { useHydrated } from "@/features/cart/use-hydrated";
import { cn } from "@/lib/cn";
import { signInSchema } from "./account-logic";
import { useSession } from "./session-store";

const NAV = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
];

function SignInForm() {
  const setCustomer = useSession((s) => s.setCustomer);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit({ email }: { email: string }) {
    setError(null);
    try {
      setCustomer(await customerRepository.signIn(email));
    } catch {
      setError("We could not sign you in. Please try again.");
    }
  }

  return (
    <GlassPanel className="max-w-md p-7 md:p-9">
      <h2 className="font-display text-2xl">Sign in</h2>
      <p className="mt-2 text-sm text-muted">Use your email to see orders and saved addresses. This is a demo sign-in: no password is needed.</p>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5" aria-label="Sign in">
        <div>
          <label htmlFor="account-email" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted">Email</label>
          <input
            id="account-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "account-email-error" : undefined}
            className="h-11 w-full rounded-md border border-line bg-page px-3 text-sm text-ink focus:border-accent focus:outline-none aria-[invalid=true]:border-danger"
            {...register("email")}
          />
          {errors.email && <p id="account-email-error" className="mt-2 text-sm text-danger">{errors.email.message}</p>}
        </div>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Signing in…" : "Continue"}</Button>
      </form>
    </GlassPanel>
  );
}

/** Shows sign-in until there is a session, then the account navigation around the page content. */
export function AccountGate({ children }: { children: ReactNode }) {
  const ready = useHydrated();
  const customer = useSession((s) => s.customer);
  const setCustomer = useSession((s) => s.setCustomer);
  const pathname = usePathname();
  const router = useRouter();

  if (!ready) return <Skeleton className="h-96 w-full" />;
  if (!customer) return <SignInForm />;

  return (
    <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
      <aside className="space-y-8">
        <div>
          <p className="font-display text-2xl">{customer.fullName}</p>
          <p className="mt-1 text-sm text-muted">{customer.email}</p>
        </div>
        <nav aria-label="Account">
          <ul className="flex gap-6 lg:flex-col lg:gap-3">
            {NAV.map((item) => {
              const active = item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? "page" : undefined} className={cn("text-sm transition-colors hover:text-accent", active ? "text-accent" : "text-ink/80")}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => {
            setCustomer(null);
            router.push("/account");
          }}
          className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
        >
          Sign out
        </button>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
