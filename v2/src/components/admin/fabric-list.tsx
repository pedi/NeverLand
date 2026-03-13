"use client";

import { useTransition } from "react";
import Image from "next/image";
import type { Fabric } from "@/lib/types";
import { deleteFabric } from "@/app/admin/fabrics/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function FabricCard({ fabric }: { fabric: Fabric }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background">
      <div className="relative aspect-square">
        <Image
          src={fabric.imageUrl}
          alt={fabric.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 150px"
        />
      </div>
      <div className="p-2">
        <p className="truncate text-sm font-medium">{fabric.name}</p>
        <Badge variant="outline" className="mt-1 text-xs">
          {fabric.priceGroup}
        </Badge>
      </div>
      <Button
        variant="destructive"
        size="icon-xs"
        className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        disabled={pending}
        onClick={() => startTransition(() => deleteFabric(fabric.id))}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export function FabricList({
  grouped,
}: {
  grouped: Record<string, Fabric[]>;
}) {
  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, fabrics]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {type}
              <Badge variant="secondary">{fabrics.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {fabrics.map((fabric) => (
                <FabricCard key={fabric.id} fabric={fabric} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
