import Link from "next/link";
import { getFabrics } from "@/lib/data";
import { FabricList } from "@/components/admin/fabric-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function FabricsPage() {
  const fabrics = await getFabrics();

  const grouped = fabrics.reduce(
    (acc, fabric) => {
      const key = fabric.type || "Uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(fabric);
      return acc;
    },
    {} as Record<string, typeof fabrics>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Fabrics</h1>
          <p className="text-sm text-muted-foreground">
            {fabrics.length} fabrics across {Object.keys(grouped).length} types
          </p>
        </div>
        <Button render={<Link href="/admin/fabrics/add" />} size="sm">
          <Plus className="mr-1 size-3.5" />
          Add Fabric
        </Button>
      </div>
      <FabricList grouped={grouped} />
    </div>
  );
}
