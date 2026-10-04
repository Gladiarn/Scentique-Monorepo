"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SavedAddress } from "@scentique/shared";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { customerRepository } from "@/data";
import { addressSchema, type AddressValues } from "./account-logic";
import { useSession } from "./session-store";

const field = "h-11 w-full rounded-md border border-line bg-page px-3 text-sm text-ink focus:border-accent focus:outline-none aria-[invalid=true]:border-danger";
const label = "mb-2 block text-xs uppercase tracking-[0.16em] text-muted";
const FIELDS: { name: keyof AddressValues; text: string }[] = [
  { name: "label", text: "Name this address" },
  { name: "fullName", text: "Recipient" },
  { name: "line1", text: "Street address" },
  { name: "city", text: "City" },
  { name: "postcode", text: "Postcode" },
  { name: "country", text: "Country" },
];

export function AddressBook() {
  const email = useSession((s) => s.customer?.email);
  const [version, setVersion] = useState(0);
  const [loaded, setLoaded] = useState<{ key: string; addresses: SavedAddress[] } | null>(null);
  const [editing, setEditing] = useState<SavedAddress | "new" | null>(null);
  const key = `${email}:${version}`;

  useEffect(() => {
    if (!email) return;
    let active = true;
    customerRepository
      .listAddresses(email)
      .then((addresses) => active && setLoaded({ key, addresses }))
      .catch(() => active && setLoaded({ key, addresses: [] }));
    return () => {
      active = false;
    };
  }, [email, key]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
  });

  if (!email || loaded?.key !== key) return <Skeleton className="h-64 w-full" />;
  const addresses = loaded.addresses;

  function startEditing(target: SavedAddress | "new") {
    setEditing(target);
    reset(target === "new" ? { label: "", fullName: "", line1: "", city: "", postcode: "", country: "United States" } : target);
  }

  async function save(values: AddressValues) {
    const parsed = addressSchema.parse(values);
    await customerRepository.saveAddress(email!, editing && editing !== "new" ? editing.id : null, parsed);
    setEditing(null);
    setVersion((v) => v + 1);
  }

  async function remove(id: string) {
    await customerRepository.deleteAddress(email!, id);
    setVersion((v) => v + 1);
  }

  return (
    <div className="space-y-10">
      {addresses.length === 0 && !editing && (
        <div className="max-w-md">
          <p className="font-display text-2xl">No saved addresses</p>
          <p className="mt-3 text-muted">Save an address to skip typing it at checkout.</p>
        </div>
      )}

      {addresses.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id}>
              <GlassPanel className="h-full space-y-3 p-6">
                <p className="font-display text-xl">{address.label}</p>
                <p className="text-sm text-ink/80">
                  {address.fullName}<br />
                  {address.line1}<br />
                  {address.city} {address.postcode}<br />
                  {address.country}
                </p>
                <div className="flex gap-5 pt-2 text-sm">
                  <button type="button" onClick={() => startEditing(address)} className="text-accent underline-offset-4 hover:underline">Edit</button>
                  <button type="button" onClick={() => remove(address.id)} className="text-muted underline-offset-4 hover:text-danger hover:underline">Delete</button>
                </div>
              </GlassPanel>
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <form noValidate onSubmit={handleSubmit(save)} aria-label={editing === "new" ? "Add address" : "Edit address"} className="grid max-w-2xl gap-5 sm:grid-cols-2">
          {FIELDS.map(({ name, text }) => (
            <div key={name} className={name === "label" || name === "line1" || name === "fullName" ? "sm:col-span-2" : undefined}>
              <label htmlFor={`addr-${name}`} className={label}>{text}</label>
              <input
                id={`addr-${name}`}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `addr-${name}-error` : undefined}
                className={field}
                {...register(name)}
              />
              {errors[name] && <p id={`addr-${name}-error`} className="mt-2 text-sm text-danger">{errors[name]?.message}</p>}
            </div>
          ))}
          <div className="flex gap-4 sm:col-span-2">
            <Button type="submit" disabled={isSubmitting}>Save address</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Button type="button" variant="secondary" onClick={() => startEditing("new")}>Add an address</Button>
      )}
    </div>
  );
}
