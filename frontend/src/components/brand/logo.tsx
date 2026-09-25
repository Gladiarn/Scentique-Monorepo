import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/*
 * Brand assets live in public/brand/ (extracted from the supplied logo file):
 *   scentique-wordmark.png  the name only, for the navbar   (689x121)
 *   scentique-mark.png      the icon only                    (262x280)
 *   scentique-lockup.png    icon + name + tagline            (689x490)
 * Swap these files (ideally for SVG) and this file is the only code that changes.
 */

/** The name only. Used in the navbar. */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} home`} className={cn("inline-flex items-center", className)}>
      <Image src="/brand/scentique-wordmark.png" alt={siteConfig.name} width={689} height={121} priority={priority} className="h-6 w-auto md:h-7" />
    </Link>
  );
}

/** The icon only. Used as the site mark (footer, closing sections) and as the favicon source. */
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/brand/scentique-mark.png" alt={siteConfig.name} width={262} height={280} className={cn("h-auto w-14", className)} />;
}

/** Icon, name and tagline together. Used sparingly, e.g. the footer. */
export function LogoLockup({ className }: { className?: string }) {
  return <Image src="/brand/scentique-lockup.png" alt={`${siteConfig.name}, parfums d'exception`} width={689} height={490} className={cn("h-auto w-56", className)} />;
}
