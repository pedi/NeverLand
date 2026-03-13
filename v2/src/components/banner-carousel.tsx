"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { Banner } from "@/lib/types";

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  if (banners.length === 0) {
    return (
      <div className="flex h-[60vh] min-h-[400px] items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-white sm:h-[70vh]">
        <p className="text-sm font-light text-muted-foreground">
          No banners available
        </p>
      </div>
    );
  }

  return (
    <Carousel opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="relative h-[60vh] min-h-[400px] sm:h-[70vh]">
              {banner.imageUrl ? (
                <Image
                  src={banner.imageUrl}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-white" />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 top-1/2 border-none bg-white/70 shadow-sm backdrop-blur-sm hover:bg-white" />
      <CarouselNext className="right-4 top-1/2 border-none bg-white/70 shadow-sm backdrop-blur-sm hover:bg-white" />
    </Carousel>
  );
}
