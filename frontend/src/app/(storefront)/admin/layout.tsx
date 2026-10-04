import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AdminGate } from "@/features/admin/admin-gate";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

/** Admin shell: denser than the storefront, same tokens and glass. Gated by the demo access code. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="pt-44 pb-12 md:pt-48 md:pb-16">
      <div className="grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-12">
        <aside className="space-y-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Admin · sample data</p>
          <nav aria-label="Admin">
            <ul className="flex gap-6 lg:flex-col lg:gap-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink/80 transition-colors hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="min-w-0">
          <AdminGate>{children}</AdminGate>
        </div>
      </div>
    </Container>
  );
}
