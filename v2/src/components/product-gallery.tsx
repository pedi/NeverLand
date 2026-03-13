"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">No images available</p>
      </div>
    );
  }

  const mainImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <Image
          src={mainImage.url}
          alt="Product image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors sm:size-20",
                index === activeIndex
                  ? "border-foreground"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image.thumbnailUrl || image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
