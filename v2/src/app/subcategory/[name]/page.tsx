import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import { getProductsBySubcategory } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const snapshot = await adminDb
    .collection("subcategories")
    .where("name", "==", decodedName)
    .limit(1)
    .get();

  if (snapshot.empty) notFound();

  const doc = snapshot.docs[0];
  const subcategory = { id: doc.id, name: doc.data().name as string };
  const products = await getProductsBySubcategory(subcategory.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-light uppercase tracking-[0.4em] text-muted-foreground">
          Collection
        </p>
        <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          {subcategory.name}
        </h1>
        <div className="h-px w-16 bg-border" />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
