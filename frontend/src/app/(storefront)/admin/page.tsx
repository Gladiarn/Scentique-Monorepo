import type { Metadata } from "next";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Em } from "@/components/ui/em";
import { orderRepository, productRepository } from "@/data";
import { FAMILIES, lowStock, revenueByFamily, topProducts } from "@/features/admin/admin-logic";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard · Admin" };

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([orderRepository.findAll(), productRepository.findAll()]);
  const revenue = revenueByFamily(orders, products);
  const top = topProducts(orders);
  const low = lowStock(products);
  const max = Math.max(1, ...FAMILIES.map((f) => revenue[f]));
  const total = FAMILIES.reduce((sum, f) => sum + revenue[f], 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl md:text-4xl">Dashboard</h1>
        <p className="text-sm text-muted">
          {orders.length} orders · <span className="tabular-nums text-ink">{formatMoney(total)}</span> revenue
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <GlassPanel className="p-6">
          <h2 className="font-display text-xl">Revenue by <Em>family</Em></h2>
          <div className="mt-8 grid grid-cols-4 items-end gap-6" role="img" aria-label="Revenue by scent family">
            {FAMILIES.map((family) => (
              <div key={family} className="flex flex-col items-center gap-3">
                <span className="text-xs tabular-nums text-muted">{formatMoney(revenue[family])}</span>
                <div className="flex h-48 w-full items-end">
                  <div
                    className="w-full rounded-t-md transition-[height] duration-500"
                    style={{ height: `${Math.max(3, (revenue[family] / max) * 100)}%`, background: `var(--color-${family})` }}
                  />
                </div>
                <span className="text-xs uppercase tracking-[0.12em] text-ink/80">{family}</span>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="font-display text-xl">Top products</h2>
          <ol className="mt-5 space-y-4 text-sm">
            {top.map((row, i) => (
              <li key={row.name} className="flex items-baseline justify-between gap-4">
                <span>
                  <span className="mr-3 text-muted tabular-nums">{i + 1}</span>
                  {row.name}
                </span>
                <span className="tabular-nums text-muted">{row.units} sold</span>
              </li>
            ))}
          </ol>
        </GlassPanel>
      </div>

      <GlassPanel className="p-6">
        <h2 className="font-display text-xl">Low stock</h2>
        {low.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Every size is comfortably stocked.</p>
        ) : (
          <table className="mt-5 w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="pb-3 font-normal">Scent</th>
                <th className="pb-3 font-normal">SKU</th>
                <th className="pb-3 font-normal">Size</th>
                <th className="pb-3 text-right font-normal">Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {low.map((row) => (
                <tr key={row.sku}>
                  <td className="py-3">{row.productName}</td>
                  <td className="py-3 text-muted">{row.sku}</td>
                  <td className="py-3">{row.sizeMl} ml</td>
                  <td className="py-3 text-right">
                    <span className={row.stock === 0 ? "text-danger" : "text-warning"}>
                      {row.stock === 0 ? "Out of stock" : `${row.stock} left`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassPanel>
    </div>
  );
}
