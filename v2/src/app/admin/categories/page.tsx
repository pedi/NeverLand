import { getAllCategories } from "@/lib/data";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage product categories and subcategories.
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
