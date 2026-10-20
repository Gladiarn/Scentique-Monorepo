import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { photoMedia } from "@/lib/media";
import type { Product } from "@scentique/shared";
import { isSoldOut, lowestPriceCents } from "./catalog-query";

/** One scent as a card: its photograph, family dot and name, and the price it starts from. A single link, nothing nested. */
export function ProductCard({ product, sizes = "(min-width: 1024px) 22vw, 78vw" }: { product: Product; sizes?: string }) {
  const media = photoMedia(product);
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-ink/15 bg-surface transition-colors group-hover:border-accent/60">
        {media?.src && (
          <Image
            src={media.src}
            alt={media.alt ?? product.name}
            fill
            sizes={sizes}
            quality={80}
            style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
            className="object-cover transition-transform duration-700 ease-out-quart group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${product.family})` }} />
        <h3 className="font-display text-xl">{product.name}</h3>
      </div>
      <p className="mt-1 text-sm text-ink/80">{isSoldOut(product) ? "Sold out" : `From ${formatMoney(lowestPriceCents(product))}`}</p>
    </Link>
  );
}
