import Image from "next/image";
import { BottleIcon, DropIcon, HourglassIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

const INGREDIENTS = [
  { src: "/images/ingredients/amber-resin.webp", label: "Amber resin", alt: "Chunks of dark amber resin", w: 400, h: 270, className: "lg:col-span-5" },
  { src: "/images/ingredients/frankincense.webp", label: "Frankincense", alt: "Pale tears of frankincense resin", w: 480, h: 260, className: "lg:col-span-5" },
  { src: "/images/ingredients/cinnamon-star-anise.webp", label: "Cinnamon and star anise", alt: "Cinnamon sticks with star anise pods", w: 912, h: 356, className: "sm:col-span-2 lg:col-span-4" },
  { src: "/images/ingredients/cinnamon-bark.webp", label: "Cinnamon bark", alt: "Curls of cinnamon bark", w: 400, h: 480, className: "sm:col-span-2 lg:col-span-3" },
] as const;

const STEPS = [
  { Icon: DropIcon, title: "Blended by hand", detail: "In twelve-litre lots" },
  { Icon: HourglassIcon, title: "Rested for six weeks", detail: "Until the blend settles" },
  { Icon: BottleIcon, title: "Bottled in small runs", detail: "Filled and checked by hand" },
] as const;

const tile = "relative overflow-hidden rounded-xl border border-line bg-surface";

/** About, as a bento: a curtain-backed statement tile, ingredient close-ups, and the process. Static placeholder copy. */
export function StorySection() {
  return (
    <section id="craft" className="py-24 md:py-32">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 sm:auto-rows-[minmax(15rem,auto)] lg:grid-cols-12 lg:grid-rows-[15rem_15rem_16rem]">
          <div className={cn(tile, "flex min-h-[26rem] items-end sm:col-span-2 lg:col-span-7 lg:row-span-2")}>
            <Image src="/images/hero/silk-backdrop.webp" alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" quality={90} className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page/90 via-page/45 to-page/10" />
            <div className="relative max-w-xl p-7 md:p-10">
              <h2 className="font-display text-3xl leading-[1.1] text-balance md:text-[length:var(--text-4xl)]">A small house with a long process</h2>
              <p className="mt-5 max-w-[52ch] text-lg text-ink/80">
                We make fewer scents than we could, and we make them slowly. Each one starts with a single raw material we want to show
                properly, then we build the rest of the blend around it until nothing is left to take away.
              </p>
            </div>
          </div>

          {INGREDIENTS.slice(0, 2).map((item) => (
            <figure key={item.src} className={cn(tile, "group min-h-[15rem]", item.className)}>
              <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" quality={90} className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]" />
              <figcaption className="absolute bottom-3 left-3 rounded-pill bg-page/55 px-3.5 py-1.5 text-sm text-ink backdrop-blur-md">{item.label}</figcaption>
            </figure>
          ))}

          <div className={cn(tile, "flex flex-col justify-center gap-5 p-7 sm:col-span-2 lg:col-span-5")}>
            <h3 className="font-display text-2xl">How it is made</h3>
            <ul className="space-y-4">
              {STEPS.map(({ Icon, title, detail }) => (
                <li key={title} className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-pill border border-line text-accent">
                    <Icon />
                  </span>
                  <div>
                    <p className="text-ink">{title}</p>
                    <p className="text-sm text-muted">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {INGREDIENTS.slice(2).map((item) => (
            <figure key={item.src} className={cn(tile, "group min-h-[15rem]", item.className)}>
              <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" quality={90} className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]" />
              <figcaption className="absolute bottom-3 left-3 rounded-pill bg-page/55 px-3.5 py-1.5 text-sm text-ink backdrop-blur-md">{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
