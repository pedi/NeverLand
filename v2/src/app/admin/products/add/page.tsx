import { getCategories } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";

export default async function AddProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Add Product</h1>
        <p className="text-sm text-muted-foreground">
          Create a new product listing.
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
