"use client";

import { useTransition } from "react";
import Image from "next/image";
import type { Downloadable } from "@/lib/types";
import { deleteDownloadable } from "@/app/admin/downloads/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";

export function DownloadList({ items }: { items: Downloadable[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.name}</p>
                <a
                  href={item.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3" />
                  Link
                </a>
              </div>
              <Button
                variant="destructive"
                size="icon-xs"
                disabled={pending}
                onClick={() =>
                  startTransition(() => deleteDownloadable(item.id))
                }
              >
                <Trash2 />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {items.length === 0 && (
        <p className="col-span-full text-center text-sm text-muted-foreground">
          No downloadables yet.
        </p>
      )}
    </div>
  );
}
