import Image from "next/image";
import { getBanners } from "@/lib/data";
import { BannerCarousel } from "@/components/banner-carousel";

export default async function Home() {
  const banners = await getBanners();

  return (
    <div>
      <section className="relative">
        <BannerCarousel banners={banners} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-light uppercase tracking-[0.4em] text-muted-foreground">
            Welcome
          </p>
          <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            NEVERLAND<sup className="text-sm">®</sup> Furniture
          </h1>
          <div className="h-px w-16 bg-border" />
          <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-muted-foreground">
            Crafting premium furniture with timeless elegance. Each piece is
            designed to bring warmth, character, and sophistication to your
            space.
          </p>
        </div>
      </section>
    </div>
  );
}
