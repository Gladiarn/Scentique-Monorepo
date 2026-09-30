import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NotFoundContent } from "@/features/errors/not-found-content";

export const metadata: Metadata = { title: "Page not found" };

/*
 * Root-level catch-all for any URL that matches no route at all. The `(storefront)` group's
 * not-found.tsx handles 404s inside the storefront (bad product slug, etc.) and is wrapped in
 * SiteHeader/SiteFooter automatically; this one sits outside that group, so it wraps them itself.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
