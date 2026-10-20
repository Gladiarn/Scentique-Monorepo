import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { FREE_SHIPPING_CENTS } from "@/features/cart/cart-logic";
import { formatMoney } from "@/lib/format";

const link = "inline-block py-1 text-ink/80 underline-offset-4 transition-colors duration-150 hover:text-accent hover:underline";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All perfumes", href: "/shop" },
      { label: "Woody", href: "/shop?family=woody" },
      { label: "Floral", href: "/shop?family=floral" },
      { label: "Citrus", href: "/shop?family=citrus" },
      { label: "Oud", href: "/shop?family=oud" },
    ],
  },
  {
    title: "The house",
    links: [
      { label: "How it is made", href: "/#about" },
      { label: "Find your scent", href: "/#quiz" },
      { label: "The seasonal letter", href: "/#close" },
    ],
  },
  {
    title: "Your order",
    links: [
      { label: "Your bag", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Account", href: "/account" },
    ],
  },
];

/** The last scene: the house line and where to go next, over a warm dark that rises out of the seam above it, ending on the name set large and cropped. */
export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-gradient-to-b from-page via-surface to-page">
      {/* The name sits inside the footer, behind the links, set very large and cropped by the page edge. */}
      <p aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 translate-y-[14%] select-none text-center font-display text-[clamp(4.5rem,19vw,19rem)] leading-[0.8] tracking-[-0.03em] text-ink/[0.06]">
        {siteConfig.name}
      </p>
      <Container className="relative grid gap-16 pb-12 pt-12 md:pt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:gap-24">
        <div>
          <p className="max-w-[18ch] font-display text-[length:var(--text-3xl)] leading-[1.1] text-balance md:text-[length:var(--text-4xl)]">{siteConfig.tagline}</p>
          <p className="mt-6 max-w-[44ch] text-ink/75">
            Blended by hand in twelve-litre lots, rested for six weeks until the blend settles, then bottled and checked one at a time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-display text-xl">{column.title}</p>
              <ul className="mt-4 space-y-1 text-sm">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      <Container className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-ink/10 py-6 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p>Free shipping over {formatMoney(FREE_SHIPPING_CENTS)}</p>
      </Container>

</footer>
  );
}
