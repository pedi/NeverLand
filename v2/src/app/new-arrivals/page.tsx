import { getNewArrivals } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-light uppercase tracking-[0.4em] text-muted-foreground">
          Latest
        </p>
        <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          New Arrivals
        </h1>
        <div className="h-px w-16 bg-border" />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
