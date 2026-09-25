import Image from "next/image";
import type { ScentFamily } from "@scentique/shared";
import { cn } from "@/lib/cn";

interface ProductImageProps {
  family: ScentFamily;
  alt: string;
  /** Real image. Omit to render the tonal placeholder. */
  src?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

/** Tonal placeholder (scent-family wash + bottle silhouette) until real photography arrives. */
export function ProductImage({ family, alt, src, width, height, priority, className }: ProductImageProps) {
  if (src) {
    return <Image src={src} alt={alt} width={width ?? 800} height={height ?? 1000} priority={priority} className={cn("h-full w-full object-cover", className)} />;
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
