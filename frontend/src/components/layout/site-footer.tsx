import Link from "next/link";
import { LogoLockup } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const columns = [
  { title: "Shop", links: [["All scents", "/shop"], ["Woody", "/shop?family=woody"], ["Floral", "/shop?family=floral"], ["Citrus", "/shop?family=citrus"], ["Oud", "/shop?family=oud"]] },
  { title: "The house", links: [["Our craft", "/#craft"], ["Find your scent", "/quiz"], ["Contact", "/contact"]] },
  { title: "Help", links: [["Shipping", "/help/shipping"], ["Returns", "/help/returns"], ["FAQ", "/help/faq"]] },
] as const;

export function SiteFooter() {
  return (
    <footer>
      <Container className="grid gap-14 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div className="space-y-5">
          <LogoLockup />
          <p className="max-w-xs text-sm text-muted">{siteConfig.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-display text-lg text-ink">{col.title}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-muted transition-colors hover:text-ink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}. Draft site with placeholder content.</p>
        <p>Prices in USD.</p>
      </Container>
    </footer>
  );
}
