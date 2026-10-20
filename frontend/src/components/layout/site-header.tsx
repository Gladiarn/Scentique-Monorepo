import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header>
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-xl">
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex gap-6 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink/80 hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
