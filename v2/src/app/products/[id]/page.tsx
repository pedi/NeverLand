import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, getFabrics, getMaterials } from "@/lib/data";
import { ProductGallery } from "@/components/product-gallery";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { ProductModel, Fabric, Material } from "@/lib/types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const fabricPriceGroups = [
    ...new Set(product.models.flatMap((m) => m.fabricsType).filter(Boolean)),
  ];
  const materialPriceGroups = [
    ...new Set(product.models.flatMap((m) => m.materialType).filter(Boolean)),
  ];

  const [fabrics, materials] = await Promise.all([
    fabricPriceGroups.length > 0 ? getFabrics(fabricPriceGroups) : Promise.resolve([]),
    materialPriceGroups.length > 0
      ? getMaterials(materialPriceGroups)
      : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} />

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">
                {product.name}
              </h1>
              {product.newArrival && <Badge variant="secondary">New</Badge>}
            </div>
            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}
          </div>

          <Separator />

          {product.availableSizesImage && (
            <>
              <div>
                <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Available Sizes
                </h2>
                <div className="relative aspect-[3/1] overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.availableSizesImage}
                    alt="Available sizes"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              </div>
              <Separator />
            </>
          )}

          {product.models.length > 0 && (
            <>
              <div>
                <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Models & Pricing
                </h2>
                <div className="space-y-4">
                  {product.models.map((model, i) => (
                    <ModelCard
                      key={i}
                      model={model}
                      fabrics={fabrics}
                      materials={materials}
                    />
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {product.deliveryTime && (
            <div>
              <h2 className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Delivery Time
              </h2>
              <p className="text-sm">{product.deliveryTime}</p>
            </div>
          )}

          {product.downloadLink && (
            <div>
              <a
                href={product.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:text-muted-foreground"
              >
                <DownloadIcon />
                Download Spec Sheet
              </a>
            </div>
          )}
        </div>
      </div>

      {fabrics.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Available Fabrics
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {fabrics.map((fabric) => (
              <SwatchCard
                key={fabric.id}
                imageUrl={fabric.imageUrl}
                name={fabric.name}
                subtitle={fabric.priceGroup}
              />
            ))}
          </div>
        </section>
      )}

      {materials.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Available Materials
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {materials.map((material) => (
              <SwatchCard
                key={material.id}
                imageUrl={material.imageUrl}
                name={material.name}
                subtitle={material.priceGroup}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ModelCard({
  model,
  fabrics,
  materials,
}: {
  model: ProductModel;
  fabrics: Fabric[];
  materials: Material[];
}) {
  const fabricGroup = model.fabricsType;
  const materialGroup = model.materialType;

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-medium">{model.name}</h3>
        {model.volume && (
          <span className="shrink-0 text-xs text-muted-foreground">
            {model.volume}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        {fabricGroup && (
          <span>
            Fabric ({fabricGroup}): ¥{model.fabricsPrice.toLocaleString()}
          </span>
        )}
        {materialGroup && (
          <span>
            Material ({materialGroup}): ¥{model.materialPrice.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

function SwatchCard({
  imageUrl,
  name,
  subtitle,
}: {
  imageUrl: string;
  name: string;
  subtitle: string;
}) {
  return (
    <div className="group flex flex-col gap-1.5">
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="120px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="px-0.5">
        <p className="truncate text-xs font-medium">{name}</p>
        <p className="truncate text-[10px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}
