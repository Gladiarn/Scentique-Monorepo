import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { BagIcon, MenuIcon, UserIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const iconLink = "inline-flex size-11 items-center justify-center rounded-md text-ink transition-colors hover:text-accent";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/95">
      <Container className="flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Logo priority />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/account" aria-label="Account" className={iconLink}>
            <UserIcon />
          </Link>
          <Link href="/cart" aria-label="Bag, 0 items" className={iconLink}>
            <BagIcon />
          </Link>
          <details className="relative md:hidden">
            <summary aria-label="Menu" className={`${iconLink} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
              <MenuIcon />
            </summary>
            <nav aria-label="Mobile" className="absolute right-0 top-12 w-64 rounded-lg border border-line bg-surface p-2 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]">
              <ul>
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex h-11 items-center rounded-md px-3 text-ink hover:bg-raised">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
