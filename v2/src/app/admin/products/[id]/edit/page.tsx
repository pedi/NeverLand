import { notFound } from "next/navigation";
import { getProduct, getCategories } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Edit Product</h1>
        <p className="text-sm text-muted-foreground">
          Update &ldquo;{product.name}&rdquo;
        </p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
