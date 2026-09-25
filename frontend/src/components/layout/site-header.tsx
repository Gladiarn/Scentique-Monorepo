"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoLockup } from "@/components/brand/logo";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./mobile-menu";
import { NavDropdown } from "./nav-dropdown";

const SCROLL_ON = 48;
const SCROLL_OFF = 16;

const actionLink =
  "relative inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-ink/85 transition-colors hover:text-accent";

/**
 * Fixed header that floats over the page. At the top it is tall and shows the full lockup;
 * once scrolled it shrinks and swaps to the wordmark alone.
 */
export function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > SCROLL_OFF : y > SCROLL_ON));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split(/[?#]/)[0] ?? href));
  const bagLabel = `Bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`;

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[height,background-color] duration-500 ease-[var(--ease-out-quart)]",
        scrolled ? "h-16 bg-page/90 backdrop-blur-glass" : "h-[7.5rem] bg-gradient-to-b from-page/75 to-transparent",
      )}
    >
      <Container className="relative z-[45] flex h-full items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <Link href="/" aria-label={`${siteConfig.name} home`} className="relative block h-full w-[7.75rem] shrink-0 justify-self-start lg:w-44">
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0 left-0 flex items-center transition-[opacity,transform] duration-500 ease-[var(--ease-out-quart)]",
              scrolled ? "pointer-events-none -translate-y-2 opacity-0" : "opacity-100",
            )}
          >
            <LogoLockup className="w-[7.75rem]" />
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0 left-0 flex items-center transition-[opacity,transform] duration-500 ease-[var(--ease-out-quart)]",
              scrolled ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
            )}
          >
            <Image src="/brand/scentique-wordmark.svg" alt="" width={679} height={120} unoptimized className="h-6 w-auto" />
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.9375rem] xl:gap-10">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                {"children" in item && item.children ? (
                  <NavDropdown label={item.label} href={item.href} items={item.children} active={isActive(item.href)} />
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn("relative inline-block py-2 transition-colors hover:text-ink", isActive(item.href) ? "text-ink" : "text-ink/80")}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span aria-hidden="true" className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-pill bg-accent" />
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-self-end gap-0.5">
          <button type="button" aria-label="Search" className={actionLink}>
            <SearchIcon />
          </button>
          <Link href="/account" aria-label="Account" className={actionLink}>
            <UserIcon />
          </Link>
          <Link href="/cart" aria-label={bagLabel} className={actionLink}>
            <BagIcon />
            <span
              aria-hidden="true"
              className="absolute right-1 top-1 grid size-4 place-items-center rounded-pill bg-accent text-[11px] font-medium leading-none text-page"
            >
              {cartCount}
            </span>
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(actionLink, "lg:hidden")}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>
      {menuOpen && <MobileMenu pathname={pathname} onNavigate={() => setMenuOpen(false)} />}
    </header>
  );
}
