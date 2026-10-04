import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductImage } from "@/components/brand/product-image";
import { Container } from "@/components/ui/container";
import { Em } from "@/components/ui/em";
import { GlassPanel } from "@/components/ui/glass-panel";
import { productRepository } from "@/data";
import { ProductCard } from "@/features/catalog/product-card";
import { VariantSelector } from "@/features/product/variant-selector";
import { formatConcentration } from "@/lib/format";
import { photoMedia } from "@/lib/media";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await productRepository.findBySlug((await params).slug);
  return { title: product?.name ?? "Scent not found" };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);
  if (!product) notFound();

  const related = (await productRepository.findAll({ family: product.family })).filter((p) => p.slug !== product.slug).slice(0, 3);
  const photos = product.media.filter((m) => m.role !== "hero");
  const hero = photoMedia(product);
  const concentrations = [...new Set(product.variants.map((v) => formatConcentration(v.concentration)))];

  return (
    <>
      <Container className="grid gap-12 pt-44 pb-16 md:pt-48 md:pb-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {(photos.length ? photos : [hero]).map((media, i) =>
            media ? (
              <div key={`${media.alt}-${i}`} className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line">
                <ProductImage
                  fill
                  family={product.family}
                  src={media.src}
                  backdrop={media.backdrop}
                  objectPosition={media.objectPosition}
                  alt={media.alt}
                  priority={i === 0}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null,
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-2 rounded-pill" style={{ background: `var(--color-${product.family})` }} />
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {product.family} · {product.gender}
            </p>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-ink/80">
            <Em>{product.tagline}</Em>
          </p>
          <p className="mt-6 max-w-prose text-ink/75">{product.description}</p>
          <p className="mt-3 text-sm text-muted">Available as {concentrations.join(", ")}.</p>

          <GlassPanel className="mt-10 p-6 md:p-7">
            <VariantSelector variants={product.variants} product={{ slug: product.slug, name: product.name, family: product.family }} />
          </GlassPanel>

          <GlassPanel className="mt-12 p-6 md:p-7">
            <h2 className="font-display text-xl">Notes</h2>
            <dl className="mt-5 grid grid-cols-3 gap-5 text-sm">
              {(
                [
                  ["Top", product.notes.top],
                  ["Heart", product.notes.heart],
                  ["Base", product.notes.base],
                ] as const
              ).map(([name, notes]) => (
                <div key={name}>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted">{name}</dt>
                  <dd className="mt-2 text-ink/90">{notes.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </GlassPanel>
        </div>
      </Container>

      {related.length > 0 && (
        <Container className="pb-24 md:pb-32">
          <h2 className="font-display text-3xl md:text-[length:var(--text-4xl)]">
            More from the <Em>{product.family}</Em> family
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ul>
        </Container>
      )}
    </>
  );
}
