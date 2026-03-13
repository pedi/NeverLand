import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];
  const src = image?.thumbnailUrl || image?.url;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-stone-100">
        {src ? (
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm font-light tracking-wide text-foreground">
        {product.name}
      </p>
    </Link>
  );
}
