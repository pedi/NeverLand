import { searchProducts } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { keyword = "" } = await searchParams;
  const products = keyword ? await searchProducts(keyword) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-light uppercase tracking-[0.4em] text-muted-foreground">
          Search Results
        </p>
        <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          {keyword ? `"${keyword}"` : "Search"}
        </h1>
        <div className="h-px w-16 bg-border" />
        {keyword && (
          <p className="text-sm font-light text-muted-foreground">
            {products.length} {products.length === 1 ? "result" : "results"}{" "}
            found
          </p>
        )}
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
