import Image from "next/image";
import type { CSSProperties } from "react";
import type { ScentFamily } from "@scentique/shared";
import { cn } from "@/lib/cn";

interface ProductImageProps {
  family: ScentFamily;
  alt: string;
  /** Real image. Omit to render the tonal placeholder. */
  src?: string;
  width?: number;
  height?: number;
  /** Fill the parent (which must be positioned) instead of using fixed dimensions. */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  /** Photo rendered under `src`, for transparent artwork. */
  backdrop?: string;
  /** Extra inline styles, e.g. CSS variables read by responsive classes. */
  style?: CSSProperties;
  className?: string;
}

/** Tonal placeholder (scent-family wash + bottle silhouette) until real photography arrives. */
export function ProductImage({ family, alt, src, width, height, fill, sizes, priority, objectPosition, backdrop, style, className }: ProductImageProps) {
  if (src) {
    const common = { src, priority, quality: 90, sizes, style: objectPosition || style ? { ...(objectPosition ? { objectPosition } : {}), ...style } : undefined };
    if (backdrop) {
      const layers = (
        <>
          <Image src={backdrop} alt="" fill sizes={sizes} quality={90} priority={priority} className="object-cover" />
          <Image {...common} alt={alt} fill className="object-cover" />
        </>
      );
      return fill ? layers : <div className={cn("relative overflow-hidden", className)}>{layers}</div>;
    }
    return fill ? (
      <Image {...common} alt={alt} fill className={cn("object-cover", className)} />
    ) : (
      <Image {...common} alt={alt} width={width ?? 800} height={height ?? 1000} className={cn("h-full w-full object-cover", className)} />
    );
  }
  const tint = `var(--color-${family})`;
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative grid place-items-center overflow-hidden", className)}
      style={{
        backgroundColor: `color-mix(in oklab, ${tint} 14%, var(--color-surface))`,
        backgroundImage: `radial-gradient(ellipse at 50% 62%, color-mix(in oklab, ${tint} 34%, transparent), transparent 62%)`,
      }}
    >
      <svg viewBox="0 0 200 250" className="h-[62%] w-auto" aria-hidden="true" style={{ color: tint }}>
        <rect x="80" y="40" width="40" height="38" rx="4" fill="var(--color-accent)" opacity="0.85" />
        <rect x="90" y="78" width="20" height="22" fill="var(--color-line)" />
        <rect x="52" y="100" width="96" height="124" rx="8" fill="currentColor" fillOpacity="0.28" stroke="var(--color-accent)" strokeOpacity="0.55" strokeWidth="1.5" />
        <rect x="64" y="116" width="6" height="92" rx="3" fill="var(--color-ink)" fillOpacity="0.16" />
        <rect x="76" y="150" width="56" height="34" rx="2" fill="none" stroke="var(--color-ink)" strokeOpacity="0.3" />
      </svg>
    </div>
  );
}
