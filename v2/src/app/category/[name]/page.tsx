import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import { getProductsByCategory } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";
import type { Category } from "@/lib/types";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const snapshot = await adminDb
    .collection("categories")
    .where("name", "==", decodedName)
    .limit(1)
    .get();

  if (snapshot.empty) notFound();

  const doc = snapshot.docs[0];
  const category = { id: doc.id, ...doc.data() } as Category;
  const products = await getProductsByCategory(category.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-light uppercase tracking-[0.4em] text-muted-foreground">
          Category
        </p>
        <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          {category.displayName || category.name}
        </h1>
        <div className="h-px w-16 bg-border" />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
