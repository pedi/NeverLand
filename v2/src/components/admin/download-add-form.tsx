"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addDownloadable } from "@/app/admin/downloads/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DownloadAddForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addDownloadable(formData);
      router.push("/admin/downloads");
    });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required disabled={pending} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="downloadLink">Download Link</Label>
            <Input
              id="downloadLink"
              name="downloadLink"
              type="url"
              placeholder="https://..."
              required
              disabled={pending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Thumbnail Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              disabled={pending}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Uploading..." : "Add Download"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/downloads")}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
