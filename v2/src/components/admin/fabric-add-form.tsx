"use client";

import { useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { addFabric } from "@/app/admin/fabrics/actions";
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

const PRICE_GROUPS = ["LLL", "LL", "L", "M", "H", "HH", "HHH"];

export function FabricAddForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addFabric(formData);
      router.push("/admin/fabrics");
    });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form ref={formRef} action={handleSubmit} className="space-y-4 max-w-md">
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
            <Label htmlFor="type">Type</Label>
            <Input id="type" name="type" required disabled={pending} />
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
              {pending ? "Uploading..." : "Add Fabric"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/fabrics")}
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
