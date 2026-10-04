"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@scentique/shared";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { productRepository } from "@/data";
import { formatConcentration, formatMoney } from "@/lib/format";
import { lowestPriceCents } from "@/features/catalog/catalog-query";
import { productFormSchema, type ProductFormOutput, type ProductFormValues } from "./admin-logic";

const field = "h-11 w-full rounded-md border border-line bg-page px-3 text-sm text-ink focus:border-accent focus:outline-none aria-[invalid=true]:border-danger";
const label = "mb-2 block text-xs uppercase tracking-[0.16em] text-muted";
const err = "mt-2 text-sm text-danger";

const BLANK_VARIANT = { sku: "", sizeMl: 50, concentration: "eau_de_parfum", price: 0, stock: 0 } as const;

export function ProductAdmin() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    productRepository.findAll().then((all) => active && setProducts(all));
    return () => {
      active = false;
    };
  }, []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues, unknown, ProductFormOutput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      family: "woody",
      gender: "unisex",
      top: "",
      heart: "",
      base: "",
      variants: [{ ...BLANK_VARIANT }],
    },
  });
  const variants = useFieldArray({ control, name: "variants" });

  if (!products) return <Skeleton className="h-96 w-full" />;

  async function onSubmit(values: ProductFormOutput) {
    setFormError(null);
    try {
      const created = await productRepository.create({
        name: values.name,
        tagline: values.tagline,
        description: values.description,
        family: values.family,
        gender: values.gender,
        notes: { top: values.top, heart: values.heart, base: values.base },
        variants: values.variants.map((v) => ({
          id: v.sku,
          sku: v.sku,
          sizeMl: v.sizeMl,
          concentration: v.concentration,
          priceCents: Math.round(v.price * 100),
          stock: v.stock,
        })),
        media: [],
      });
      setProducts((list) => [...(list ?? []), created]);
      setMessage(`${created.name} is on the shelf.`);
      setAdding(false);
      reset();
    } catch {
      setFormError("The scent could not be saved. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted" aria-live="polite">{message ?? `${products.length} scents`}</p>
        {!adding && <Button type="button" variant="secondary" onClick={() => { setAdding(true); setMessage(null); }}>Add a scent</Button>}
      </div>

      {adding && (
        <GlassPanel className="p-6 md:p-8">
          <form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Add a scent" className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="p-name" className={label}>Name</label>
                <input id="p-name" aria-invalid={Boolean(errors.name)} className={field} {...register("name")} />
                {errors.name && <p className={err}>{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="p-tagline" className={label}>Tagline</label>
                <input id="p-tagline" aria-invalid={Boolean(errors.tagline)} className={field} {...register("tagline")} />
                {errors.tagline && <p className={err}>{errors.tagline.message}</p>}
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="p-description" className={label}>Description</label>
              <textarea id="p-description" rows={3} aria-invalid={Boolean(errors.description)} className={`${field} h-auto py-3`} {...register("description")} />
              {errors.description && <p className={err}>{errors.description.message}</p>}
            </div>

            <div>
              <label htmlFor="p-family" className={label}>Scent family</label>
              <select id="p-family" className={field} {...register("family")}>
                <option value="woody">Woody</option>
                <option value="floral">Floral</option>
                <option value="citrus">Citrus</option>
                <option value="oud">Oud</option>
              </select>
              {errors.family && <p className={err}>{errors.family.message}</p>}
            </div>
            <div>
              <label htmlFor="p-gender" className={label}>For</label>
              <select id="p-gender" className={field} {...register("gender")}>
                <option value="feminine">Feminine</option>
                <option value="masculine">Masculine</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            {(["top", "heart", "base"] as const).map((layer) => (
              <div key={layer} className="md:col-span-2 md:first:col-span-1">
                <label htmlFor={`p-${layer}`} className={label}>{layer} notes, comma separated</label>
                <input id={`p-${layer}`} aria-invalid={Boolean(errors[layer])} className={field} {...register(layer)} />
                {errors[layer] && <p className={err}>{errors[layer]?.message}</p>}
              </div>
            ))}

            <fieldset className="md:col-span-2 space-y-4">
              <legend className="font-display text-xl">Sizes and prices</legend>
              {variants.fields.map((row, i) => (
                <div key={row.id} className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-[1.2fr_0.7fr_1fr_0.6fr_0.6fr_auto] sm:items-end">
                  <div>
                    <label htmlFor={`v-${i}-sku`} className={label}>SKU</label>
                    <input id={`v-${i}-sku`} className={field} {...register(`variants.${i}.sku`)} />
                    {errors.variants?.[i]?.sku && <p className={err}>{errors.variants[i]?.sku?.message}</p>}
                  </div>
                  <div>
                    <label htmlFor={`v-${i}-size`} className={label}>ml</label>
                    <input id={`v-${i}-size`} type="number" className={field} {...register(`variants.${i}.sizeMl`)} />
                  </div>
                  <div>
                    <label htmlFor={`v-${i}-conc`} className={label}>Concentration</label>
                    <select id={`v-${i}-conc`} className={field} {...register(`variants.${i}.concentration`)}>
                      {(["eau_de_toilette", "eau_de_parfum", "extrait"] as const).map((c) => (
                        <option key={c} value={c}>{formatConcentration(c)}</option>
                      ))}
                    </select>
                    {errors.variants?.[i]?.concentration && <p className={err}>{errors.variants[i]?.concentration?.message}</p>}
                  </div>
                  <div>
                    <label htmlFor={`v-${i}-price`} className={label}>Price (USD)</label>
                    <input id={`v-${i}-price`} type="number" step="0.01" className={field} {...register(`variants.${i}.price`)} />
                    {errors.variants?.[i]?.price && <p className={err}>{errors.variants[i]?.price?.message}</p>}
                  </div>
                  <div>
                    <label htmlFor={`v-${i}-stock`} className={label}>Stock</label>
                    <input id={`v-${i}-stock`} type="number" className={field} {...register(`variants.${i}.stock`)} />
                    {errors.variants?.[i]?.stock && <p className={err}>{errors.variants[i]?.stock?.message}</p>}
                  </div>
                  <button type="button" onClick={() => variants.remove(i)} disabled={variants.fields.length === 1} className="h-11 text-sm text-muted underline-offset-4 hover:text-danger hover:underline disabled:opacity-40">
                    Remove
                  </button>
                </div>
              ))}
              {errors.variants?.root && <p className={err}>{errors.variants.root.message}</p>}
              {errors.variants && !errors.variants.root && typeof errors.variants.message === "string" && <p className={err}>{errors.variants.message}</p>}
              <Button type="button" variant="ghost" onClick={() => variants.append({ ...BLANK_VARIANT })}>Add another size</Button>
            </fieldset>

            {formError && <p role="alert" className="md:col-span-2 text-sm text-danger">{formError}</p>}

            <div className="md:col-span-2 flex flex-wrap gap-4">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save scent"}</Button>
              <Button type="button" variant="ghost" onClick={() => { setAdding(false); setFormError(null); }}>Cancel</Button>
            </div>
          </form>
        </GlassPanel>
      )}

      <GlassPanel className="overflow-x-auto p-2">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Scent</th>
              <th className="px-4 py-3 font-normal">Family</th>
              <th className="px-4 py-3 font-normal">Sizes</th>
              <th className="px-4 py-3 text-right font-normal">From</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 capitalize text-muted">{p.family}</td>
                <td className="px-4 py-3 text-muted">{p.variants.length}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(lowestPriceCents(p))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>
    </div>
  );
}
