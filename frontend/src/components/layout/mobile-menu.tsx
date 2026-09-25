"use client";

import Link from "next/link";
import { useEffect } from "react";
import { siteConfig } from "@/config/site";

interface MobileMenuProps {
  pathname: string;
  onNavigate: () => void;
}

/** Full-screen menu for small screens. Locks page scroll while open. */
export function MobileMenu({ pathname, onNavigate }: MobileMenuProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split(/[?#]/)[0] ?? href));

  return (
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-40 overflow-y-auto bg-page px-6 pb-12 pt-28">
      <nav aria-label="Mobile">
        <ul className="divide-y divide-line border-y border-line">
          {siteConfig.nav.map((item) => (
            <li key={item.href} className="py-4">
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="block font-display text-2xl text-ink"
              >
                {item.label}
              </Link>
              {"children" in item && item.children && (
                <ul className="mt-3 grid grid-cols-2 gap-x-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} onClick={onNavigate} className="flex h-11 items-center gap-2 text-sm text-muted hover:text-ink">
                        {child.family && <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${child.family})` }} />}
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
