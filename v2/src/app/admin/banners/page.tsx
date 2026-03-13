import { getBanners } from "@/lib/data";
import { BannerManager } from "@/components/admin/banner-manager";

export default async function BannersPage() {
  const banners = await getBanners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Banners</h1>
        <p className="text-sm text-muted-foreground">
          {banners.length} banner{banners.length !== 1 ? "s" : ""}
        </p>
      </div>
      <BannerManager banners={banners} />
    </div>
  );
}
