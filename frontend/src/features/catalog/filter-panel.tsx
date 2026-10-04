"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SORTS, SORT_LABELS, type CatalogSort } from "./catalog-query";

const FAMILY_OPTIONS = [
  { value: "", label: "All families" },
  { value: "woody", label: "Woody" },
  { value: "floral", label: "Floral" },
  { value: "citrus", label: "Citrus" },
  { value: "oud", label: "Oud" },
];

const GENDER_OPTIONS = [
  { value: "", label: "Everyone" },
  { value: "feminine", label: "Feminine" },
  { value: "masculine", label: "Masculine" },
  { value: "unisex", label: "Unisex" },
];

const control = "h-11 w-full rounded-md border border-line bg-page px-3 text-sm text-ink focus:border-accent focus:outline-none";
const label = "mb-2 block text-xs uppercase tracking-[0.16em] text-muted";

/** Filters and sort live in the URL, so a filtered view can be shared and survives a reload. */
export function FilterPanel({ maxPriceDollars }: { maxPriceDollars: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const current = (key: string) => params.get(key) ?? "";
  const priceValue = Number(current("max")) || maxPriceDollars;

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  return (
    <GlassPanel className="grid gap-6 p-6 md:grid-cols-2 md:p-7 xl:grid-cols-[1fr_1fr_1.4fr_1fr] xl:items-end">
      <div>
        <label htmlFor="filter-family" className={label}>Scent family</label>
        <select id="filter-family" className={control} value={current("family")} onChange={(e) => update("family", e.target.value)}>
          {FAMILY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="filter-gender" className={label}>For</label>
        <select id="filter-gender" className={control} value={current("gender")} onChange={(e) => update("gender", e.target.value)}>
          {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="filter-price" className={label}>Up to ${priceValue}</label>
        <input
          id="filter-price"
          type="range"
          min={10}
          max={maxPriceDollars}
          step={5}
          value={priceValue}
          onChange={(e) => update("max", Number(e.target.value) >= maxPriceDollars ? "" : e.target.value)}
          className="w-full accent-[var(--color-accent)]"
        />
      </div>

      <div>
        <label htmlFor="filter-sort" className={label}>Sort by</label>
        <select id="filter-sort" className={control} value={current("sort") || "featured"} onChange={(e) => update("sort", e.target.value as CatalogSort)}>
          {SORTS.map((s) => <option key={s} value={s}>{SORT_LABELS[s]}</option>)}
        </select>
      </div>
    </GlassPanel>
  );
}
