import Image from "next/image";
import { BottleIcon, DropIcon, HourglassIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { GlassPanel } from "@/components/ui/glass-panel";
import { cn } from "@/lib/cn";

const PHOTOS = [
  { src: "/images/ingredients/amber-resin.webp", label: "Amber resin", alt: "Chunks of dark amber resin", sizes: "(min-width: 1024px) 40vw, 100vw", tall: true },
  { src: "/images/ingredients/frankincense.webp", label: "Frankincense", alt: "Pale tears of frankincense resin", sizes: "(min-width: 1024px) 30vw, 100vw", tall: false },
  { src: "/images/ingredients/cinnamon-star-anise.webp", label: "Cinnamon and star anise", alt: "Cinnamon sticks with star anise pods", sizes: "(min-width: 1024px) 30vw, 100vw", tall: false },
] as const;

const STEPS = [
  { Icon: DropIcon, title: "Blended by hand", detail: "In twelve-litre lots" },
  { Icon: HourglassIcon, title: "Rested for six weeks", detail: "Until the blend settles" },
  { Icon: BottleIcon, title: "Bottled in small runs", detail: "Filled and checked by hand" },
] as const;

const caption = "absolute bottom-4 left-4 rounded-pill bg-page/55 px-3.5 py-1.5 text-sm text-ink backdrop-blur-glass";

/** About: one large statement frame, then ingredient photography beside the process. Static editorial copy. */
export function StorySection() {
  return (
    <section id="craft" className="py-24 md:py-32">
      <Container>
        <div className="relative isolate min-h-[30rem] overflow-hidden rounded-xl md:min-h-[38rem]">
          <Image src="/images/hero/silk-backdrop.webp" alt="" fill sizes="100vw" quality={90} className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-page via-page/50 to-page/10" />
          <div className="relative flex h-full min-h-[30rem] items-end p-7 md:min-h-[38rem] md:p-14">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-[1.1] text-balance md:text-[length:var(--text-4xl)]">
                A small house with a <Em>long process</Em>
              </h2>
              <p className="mt-5 max-w-[52ch] text-lg text-ink/80">
                We make fewer scents than we could, and we make them slowly. Each one starts with a single raw material we want to show
                properly, then we build the rest of the blend around it until nothing is left to take away.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-10">
          <div className="grid gap-6 sm:grid-cols-2">
            {PHOTOS.map((photo) => (
              <figure
                key={photo.src}
                className={cn(
                  "group relative overflow-hidden rounded-xl",
                  photo.tall ? "aspect-[4/5] sm:row-span-2" : "aspect-[4/3] sm:mt-12",
                )}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={photo.sizes}
                  quality={90}
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
                />
                <figcaption className={caption}>{photo.label}</figcaption>
              </figure>
            ))}
          </div>

          <GlassPanel className="flex flex-col gap-7 p-7 md:p-9">
            <h3 className="font-display text-2xl">How it is made</h3>
            <ul className="space-y-6">
              {STEPS.map(({ Icon, title, detail }) => (
                <li key={title} className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-pill border border-ink/20 text-accent">
                    <Icon />
                  </span>
                  <div>
                    <p className="text-ink">{title}</p>
                    <p className="text-sm text-muted">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </Container>
    </section>
  );
}
