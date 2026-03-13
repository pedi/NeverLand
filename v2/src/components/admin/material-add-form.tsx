"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addMaterial } from "@/app/admin/materials/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRICE_GROUPS = ["oak", "elm", "pine"];

export function MaterialAddForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addMaterial(formData);
      router.push("/admin/materials");
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
            <Label htmlFor="priceGroup">Price Group</Label>
            <Select name="priceGroup" required>
              <SelectTrigger id="priceGroup">
                <SelectValue placeholder="Select price group" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_GROUPS.map((pg) => (
                  <SelectItem key={pg} value={pg}>
                    {pg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
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
              {pending ? "Uploading..." : "Add Material"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/materials")}
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
