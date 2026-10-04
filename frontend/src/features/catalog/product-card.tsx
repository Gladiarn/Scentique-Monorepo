import Link from "next/link";
import { ProductImage } from "@/components/brand/product-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatMoney } from "@/lib/format";
import { photoMedia } from "@/lib/media";
import { cn } from "@/lib/cn";
import type { Product } from "@scentique/shared";
import { isSoldOut, lowestPriceCents } from "./catalog-query";

/** The scent card: photograph, name, family dot, price from, and a link to the product page. */
export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const media = photoMedia(product);
  const soldOut = isSoldOut(product);
  return (
    <li className={className}>
      <Link
        href={`/product/${product.slug}`}
        className="group relative block overflow-hidden rounded-xl border border-line transition-colors hover:border-accent/60"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <ProductImage
            fill
            family={product.family}
            src={media?.src}
            backdrop={media?.backdrop}
            objectPosition={media?.objectPosition}
            alt={media?.alt ?? product.name}
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page/85 via-transparent to-transparent" />
        </div>
        <div className="flex items-end justify-between gap-4 p-5">
          <div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${product.family})` }} />
              <h3 className="font-display text-xl leading-tight">{product.name}</h3>
            </div>
            <p className={cn("mt-1 text-sm", soldOut ? "text-muted" : "text-ink/75")}>
              {soldOut ? "Sold out" : `From ${formatMoney(lowestPriceCents(product))}`}
            </p>
          </div>
          <ArrowRightIcon width={16} height={16} className="mb-1 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </li>
  );
}
