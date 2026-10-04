import type { Metadata } from "next";
import { Em } from "@/components/ui/em";
import { ProductAdmin } from "@/features/admin/product-admin";

export const metadata: Metadata = { title: "Products · Admin" };

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl md:text-4xl">
        <Em>Products</Em>
      </h1>
      <ProductAdmin />
    </div>
  );
}
