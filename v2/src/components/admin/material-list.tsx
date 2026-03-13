"use client";

import { useTransition } from "react";
import Image from "next/image";
import type { Material } from "@/lib/types";
import { deleteMaterial } from "@/app/admin/materials/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function MaterialCard({ material }: { material: Material }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background">
      <div className="relative aspect-square">
        <Image
          src={material.imageUrl}
          alt={material.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 150px"
        />
      </div>
      <div className="p-2">
        <p className="truncate text-sm font-medium">{material.name}</p>
        <Badge variant="outline" className="mt-1 text-xs">
          {material.priceGroup}
        </Badge>
      </div>
      <Button
        variant="destructive"
        size="icon-xs"
        className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        disabled={pending}
        onClick={() => startTransition(() => deleteMaterial(material.id))}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export function MaterialList({
  grouped,
}: {
  grouped: Record<string, Material[]>;
}) {
  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([group, materials]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {group}
              <Badge variant="secondary">{materials.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
