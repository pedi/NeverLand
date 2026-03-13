import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/data";
import { deleteProduct } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/add">
            <Plus className="mr-1.5 size-3.5" />
            Add New
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="mb-3 size-10 text-muted-foreground" />
          <p className="text-sm font-medium">No products yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Get started by adding your first product.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="gap-0 overflow-hidden py-0">
              <div className="relative aspect-[4/3] bg-muted">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Package className="size-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute right-2 top-2 flex gap-1">
                  {product.newArrival && (
                    <Badge variant="secondary" className="text-[10px]">
                      New
                    </Badge>
                  )}
                  {product.smallLot && (
                    <Badge variant="secondary" className="text-[10px]">
                      Small Lot
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon-xs" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <form
                    action={deleteProduct.bind(null, product.id)}
                  >
                    <Button variant="ghost" size="icon-xs" type="submit">
                      <Trash2 className="text-destructive" />
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
