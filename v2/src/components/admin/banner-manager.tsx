"use client";

import { useTransition, useRef } from "react";
import Image from "next/image";
import type { Banner } from "@/lib/types";
import { addBanner, deleteBanner } from "@/app/admin/banners/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";

export function BannerManager({ banners }: { banners: Banner[] }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      await addBanner(formData);
      formRef.current?.reset();
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form ref={formRef} action={handleUpload} className="flex items-end gap-3">
            <div className="space-y-2">
              <Label htmlFor="image">Upload Banner</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required
                disabled={pending}
              />
            </div>
            <Button type="submit" size="sm" disabled={pending}>
              <Upload className="mr-1 size-3.5" />
              {pending ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="group relative overflow-hidden rounded-lg border bg-background"
          >
            <div className="relative aspect-[16/6]">
              <Image
                src={banner.imageUrl}
                alt="Banner"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
              disabled={pending}
              onClick={() => startTransition(() => deleteBanner(banner.id))}
            >
              <Trash2 className="mr-1 size-3.5" />
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
