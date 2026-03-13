import Link from "next/link";
import { getMaterials } from "@/lib/data";
import { MaterialList } from "@/components/admin/material-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function MaterialsPage() {
  const materials = await getMaterials();

  const grouped = materials.reduce(
    (acc, mat) => {
      const key = mat.priceGroup || "Uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(mat);
      return acc;
    },
    {} as Record<string, typeof materials>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Materials</h1>
          <p className="text-sm text-muted-foreground">
            {materials.length} materials across {Object.keys(grouped).length} groups
          </p>
        </div>
        <Button render={<Link href="/admin/materials/add" />} size="sm">
          <Plus className="mr-1 size-3.5" />
          Add Material
        </Button>
      </div>
      <MaterialList grouped={grouped} />
    </div>
  );
}
