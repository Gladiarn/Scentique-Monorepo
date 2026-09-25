import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/*
 * Brand assets are vectors in public/brand/, traced from the supplied logo:
 *   scentique-wordmark.svg  the name only, for the navbar
 *   scentique-mark.svg      the icon only
 *   scentique-lockup.svg    icon + name + tagline
 *   scentique-tagline.svg   the tagline only
 * Swap these files for the designer's originals and this file is the only code that changes.
 * SVGs need no image optimisation, so they are served as-is (`unoptimized`).
 */

/** The name only. Used in the navbar. */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} home`} className={cn("inline-flex items-center", className)}>
      <Image src="/brand/scentique-wordmark.svg" alt={siteConfig.name} width={679} height={120} priority={priority} unoptimized className="h-6 w-auto md:h-7" />
    </Link>
  );
}

/** The icon only. Used as the site mark and as the favicon source. */
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/brand/scentique-mark.svg" alt={siteConfig.name} width={251} height={279} unoptimized className={cn("h-auto w-14", className)} />;
}

/** Icon, name and tagline together. Used sparingly, e.g. the footer. */
export function LogoLockup({ className }: { className?: string }) {
  return <Image src="/brand/scentique-lockup.svg" alt={`${siteConfig.name}, parfums d'exception`} width={679} height={487} unoptimized className={cn("h-auto w-56", className)} />;
}
