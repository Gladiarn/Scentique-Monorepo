import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productRepository } from "@/data";
import { ProductDetail } from "@/features/product/product-detail";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await productRepository.findBySlug((await params).slug);
  return product ? { title: product.name, description: product.tagline } : {};
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await productRepository.findBySlug((await params).slug);
  if (!product) notFound();
  const sameFamily = await productRepository.findAll({ family: product.family });
  return <ProductDetail product={product} related={sameFamily.filter((p) => p.id !== product.id).slice(0, 3)} />;
}
