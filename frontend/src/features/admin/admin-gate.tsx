"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/features/cart/use-hydrated";
import { isAccessCodeValid } from "./admin-access";

const useAdminSession = create<{ granted: boolean; set: (granted: boolean) => void }>()(
  persist(
    (set) => ({ granted: false, set: (granted) => set({ granted }) }),
    { name: "scentique-admin", version: 1, storage: createJSONStorage(() => localStorage), partialize: (s) => ({ granted: s.granted }) },
  ),
);

const schema = z.object({ code: z.string().trim().min(1, "Enter the staff access code") });

export function AdminGate({ children }: { children: ReactNode }) {
  const ready = useHydrated();
  const granted = useAdminSession((s) => s.granted);
  const setGranted = useAdminSession((s) => s.set);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<{ code: string }>({ resolver: zodResolver(schema) });

  if (!ready) return <Skeleton className="h-96 w-full" />;

  if (granted) {
    return (
      <div className="space-y-8">
        <div className="flex justify-end">
          <button type="button" onClick={() => setGranted(false)} className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline">
            Lock console
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <GlassPanel className="max-w-md p-7 md:p-9">
      <h1 className="font-display text-2xl">Staff access</h1>
      <p className="mt-2 text-sm text-muted">Enter the staff access code. This is a demo gate until real staff sign-in is built.</p>
      <form
        noValidate
        aria-label="Staff access"
        className="mt-7 space-y-5"
        onSubmit={handleSubmit(({ code }) => {
          if (isAccessCodeValid(code)) {
            setError(null);
            setGranted(true);
          } else {
            setError("That access code is not recognised.");
          }
        })}
      >
        <div>
          <label htmlFor="admin-code" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted">Access code</label>
          <input
            id="admin-code"
            type="password"
            autoComplete="off"
            aria-invalid={Boolean(errors.code || error)}
            aria-describedby={error || errors.code ? "admin-code-error" : undefined}
            className="h-11 w-full rounded-md border border-line bg-page px-3 text-sm text-ink focus:border-accent focus:outline-none aria-[invalid=true]:border-danger"
            {...register("code")}
          />
          {(errors.code || error) && (
            <p id="admin-code-error" role="alert" className="mt-2 text-sm text-danger">{errors.code?.message ?? error}</p>
          )}
        </div>
        <Button type="submit" className="w-full">Enter the console</Button>
      </form>
    </GlassPanel>
  );
}
