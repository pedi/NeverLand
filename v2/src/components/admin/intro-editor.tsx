"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import type { IntroImage } from "@/lib/types";
import {
  updateIntro,
  addIntroImage,
  deleteIntroImage,
} from "@/app/admin/contact/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Upload, Trash2 } from "lucide-react";

export function IntroEditor({
  type,
  content: initialContent,
  images,
}: {
  type: string;
  content: string;
  images: IntroImage[];
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSaveContent() {
    startTransition(async () => {
      await updateIntro(type, content);
    });
  }

  function handleUploadImage(formData: FormData) {
    startTransition(async () => {
      await addIntroImage(type, formData);
      formRef.current?.reset();
    });
  }

  function handleDeleteImage(index: number) {
    startTransition(async () => {
      await deleteIntroImage(type, index);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            disabled={pending}
          />
          <Button
            size="sm"
            onClick={handleSaveContent}
            disabled={pending || content === initialContent}
          >
            <Save className="mr-1 size-3.5" />
            {pending ? "Saving..." : "Save Content"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            ref={formRef}
            action={handleUploadImage}
            className="flex items-end gap-3"
          >
            <div className="space-y-2">
              <Label htmlFor="image">Add Image</Label>
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border"
              >
                <div className="relative aspect-video">
                  <Image
                    src={img.url}
                    alt={`${type} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon-xs"
                  className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={pending}
                  onClick={() => handleDeleteImage(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No images yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
