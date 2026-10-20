import Image from "next/image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ScrollVars } from "./scroll-vars";

/**
 * Act five, the resolved ending: the screen pins and holds on the house line and one clear ask, over a dimmed
 * photograph, so the last feeling is the one the visitor carries into the footer. It arrives out of the page colour (a
 * top fade that clears as it comes in) so no hard edge meets the reviews above it.
 */
export function Close() {
  return (
    <section id="close" aria-labelledby="close-heading" data-scrub-section="" className="relative h-[160svh]">
      <ScrollVars />
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden bg-page">
        <Image src="/images/categories/oud.webp" alt="" fill sizes="100vw" quality={70} className="object-cover opacity-40" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page via-page/40 to-page/70" />
        <div
          data-plane="enter"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-page via-page/70 to-transparent"
          style={{ opacity: "calc(1 - var(--e, 1))" }}
        />
        <div className="relative px-6 text-center">
          <h2 id="close-heading" className="mx-auto max-w-3xl font-display text-[clamp(2.25rem,1.2rem+3.2vw,4rem)] leading-[1.06] text-balance">
            {siteConfig.tagline}
          </h2>
          <Button href="/shop" className="mt-10">
            Shop all perfumes
          </Button>
        </div>
      </div>
    </section>
  );
}
