"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { Product, Category, ProductModel, ProductImage } from "@/lib/types";
import {
  createProduct,
  updateProduct,
  deleteProductImage,
} from "@/app/admin/products/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, X, Loader2 } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

function emptyModel(): ProductModel {
  return {
    name: "",
    volume: "",
    fabricsType: [],
    fabricsPrice: [],
    materialType: [],
    materialPrice: [],
  };
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const [pending, startTransition] = useTransition();
  const isEditing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
  const [newArrival, setNewArrival] = useState(product?.newArrival ?? false);
  const [smallLot, setSmallLot] = useState(product?.smallLot ?? false);
  const [deliveryTime, setDeliveryTime] = useState(product?.deliveryTime ?? "");
  const [batchRatio, setBatchRatio] = useState(product?.batchRatio ?? 0);
  const [batchThreshold, setBatchThreshold] = useState(
    product?.batchThreshold ?? 0
  );
  const [downloadLink, setDownloadLink] = useState(
    product?.downloadLink ?? ""
  );

  const [existingImages, setExistingImages] = useState<ProductImage[]>(
    product?.images ?? []
  );
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [availableSizesFile, setAvailableSizesFile] = useState<File | null>(
    null
  );
  const [existingAvailableSizesImage] = useState(
    product?.availableSizesImage ?? ""
  );

  const [models, setModels] = useState<ProductModel[]>(
    product?.models ?? []
  );

  const selectedCategory = categories.find((c) => c.id === category);
  const subcategories = selectedCategory?.subcategories ?? [];

  function handleCategoryChange(value: string | null) {
    setCategory(value ?? "");
    setSubcategory("");
  }

  function handleRemoveExistingImage(index: number) {
    if (!product) return;
    startTransition(async () => {
      await deleteProductImage(product.id, index);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    });
  }

  function handleRemoveNewImage(index: number) {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateModel(index: number, patch: Partial<ProductModel>) {
    setModels((prev) =>
      prev.map((m, i) => (i === index ? { ...m, ...patch } : m))
    );
  }

  function removeModel(index: number) {
    setModels((prev) => prev.filter((_, i) => i !== index));
  }

  function addFabricPair(modelIndex: number) {
    setModels((prev) =>
      prev.map((m, i) =>
        i === modelIndex
          ? {
              ...m,
              fabricsType: [...m.fabricsType, ""],
              fabricsPrice: [...m.fabricsPrice, 0],
            }
          : m
      )
    );
  }

  function removeFabricPair(modelIndex: number, pairIndex: number) {
    setModels((prev) =>
      prev.map((m, i) =>
        i === modelIndex
          ? {
              ...m,
              fabricsType: m.fabricsType.filter((_, j) => j !== pairIndex),
              fabricsPrice: m.fabricsPrice.filter((_, j) => j !== pairIndex),
            }
          : m
      )
    );
  }

  function updateFabricType(
    modelIndex: number,
    pairIndex: number,
    value: string
  ) {
    setModels((prev) =>
      prev.map((m, i) =>
        i === modelIndex
          ? {
              ...m,
              fabricsType: m.fabricsType.map((t, j) =>
                j === pairIndex ? value : t
              ),
            }
          : m
      )
    );
  }

  function updateFabricPrice(
    modelIndex: number,
    pairIndex: number,
    value: number
  ) {
    setModels((prev) =>
      prev.map((m, i) =>
        i === modelIndex
          ? {
              ...m,
              fabricsPrice: m.fabricsPrice.map((p, j) =>
                j === pairIndex ? value : p
              ),
            }
          : m
      )
    );
  }

  function addMaterialPair(modelIndex: number) {
    setModels((prev) =>
      prev.map((m, i) =>
        i === modelIndex
          ? {
              ...m,
              materialType: [...m.materialType, ""],
              materialPrice: [...m.materialPrice, 0],
            }
          : m
      )
    );
  }

  function removeMaterialPair(modelIndex: number, pairIndex: number) {
    setModels((prev) =>
      prev.map((m, i) =>
        i === modelIndex
          ? {
              ...m,
              materialType: m.materialType.filter((_, j) => j !== pairIndex),
              materialPrice: m.materialPrice.filter((_, j) => j !== pairIndex),
            }
          : m
      )
    );
  }

  function updateMaterialType(
    modelIndex: number,
    pairIndex: number,
    value: string
  ) {
    setModels((prev) =>
      prev.map((m, i) =>
        i === modelIndex
          ? {
              ...m,
              materialType: m.materialType.map((t, j) =>
                j === pairIndex ? value : t
              ),
            }
          : m
      )
    );
  }

  function updateMaterialPrice(
    modelIndex: number,
    pairIndex: number,
    value: number
  ) {
    setModels((prev) =>
      prev.map((m, i) =>
        i === modelIndex
          ? {
              ...m,
              materialPrice: m.materialPrice.map((p, j) =>
                j === pairIndex ? value : p
              ),
            }
          : m
      )
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("subcategory", subcategory);
    formData.set("newArrival", String(newArrival));
    formData.set("smallLot", String(smallLot));
    formData.set("deliveryTime", deliveryTime);
    formData.set("batchRatio", String(batchRatio));
    formData.set("batchThreshold", String(batchThreshold));
    formData.set("downloadLink", downloadLink);
    formData.set("models", JSON.stringify(models));

    if (isEditing) {
      formData.set("existingImages", JSON.stringify(existingImages));
      formData.set("existingAvailableSizesImage", existingAvailableSizesImage);
    }

    for (const file of newImageFiles) {
      formData.append("images", file);
    }

    if (availableSizesFile) {
      formData.set("availableSizesImage", availableSizesFile);
    }

    startTransition(async () => {
      if (isEditing) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={pending}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={pending}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full" disabled={pending}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.displayName || cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Subcategory</Label>
              <Select value={subcategory} onValueChange={(v) => setSubcategory(v ?? "")}>
                <SelectTrigger className="w-full" disabled={pending || !category}>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                disabled={pending}
                className="size-4 rounded border-input accent-primary"
              />
              <span className="text-sm font-medium">New Arrival</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={smallLot}
                onChange={(e) => setSmallLot(e.target.checked)}
                disabled={pending}
                className="size-4 rounded border-input accent-primary"
              />
              <span className="text-sm font-medium">Small Lot</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="batchRatio">Batch Ratio</Label>
              <Input
                id="batchRatio"
                type="number"
                value={batchRatio}
                onChange={(e) => setBatchRatio(parseFloat(e.target.value) || 0)}
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="batchThreshold">Batch Threshold</Label>
              <Input
                id="batchThreshold"
                type="number"
                value={batchThreshold}
                onChange={(e) =>
                  setBatchThreshold(parseFloat(e.target.value) || 0)
                }
                disabled={pending}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="downloadLink">Download Link</Label>
            <Input
              id="downloadLink"
              value={downloadLink}
              onChange={(e) => setDownloadLink(e.target.value)}
              disabled={pending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="space-y-1.5">
              <Label>Current Images</Label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="group relative">
                    <div className="relative size-24 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={img.url}
                        alt={`Image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-xs"
                      className="absolute -right-1.5 -top-1.5"
                      disabled={pending}
                      onClick={() => handleRemoveExistingImage(i)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New image previews */}
          {newImageFiles.length > 0 && (
            <div className="space-y-1.5">
              <Label>New Images</Label>
              <div className="flex flex-wrap gap-3">
                {newImageFiles.map((file, i) => (
                  <div key={i} className="group relative">
                    <div className="relative size-24 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-xs"
                      className="absolute -right-1.5 -top-1.5"
                      onClick={() => handleRemoveNewImage(i)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="images">Add Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              disabled={pending}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                setNewImageFiles((prev) => [...prev, ...files]);
                e.target.value = "";
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sizesImage">Available Sizes Image</Label>
            {existingAvailableSizesImage && !availableSizesFile && (
              <div className="relative mb-2 h-24 w-40 overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={existingAvailableSizesImage}
                  alt="Sizes"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            )}
            <Input
              id="sizesImage"
              type="file"
              accept="image/*"
              disabled={pending}
              onChange={(e) =>
                setAvailableSizesFile(e.target.files?.[0] ?? null)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Models / Pricing */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Models &amp; Pricing</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => setModels((prev) => [...prev, emptyModel()])}
          >
            <Plus className="mr-1 size-3.5" />
            Add Model
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {models.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No models added yet.
            </p>
          )}

          {models.map((model, mi) => (
            <Card key={mi} size="sm" className="bg-muted/30">
              <CardHeader className="flex-row items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Model {mi + 1}</Badge>
                  {model.name && (
                    <span className="text-sm font-medium">{model.name}</span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={pending}
                  onClick={() => removeModel(mi)}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Model Name</Label>
                    <Input
                      value={model.name}
                      onChange={(e) =>
                        updateModel(mi, { name: e.target.value })
                      }
                      placeholder="e.g. Single Seat"
                      disabled={pending}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Volume</Label>
                    <Input
                      value={model.volume}
                      onChange={(e) =>
                        updateModel(mi, { volume: e.target.value })
                      }
                      disabled={pending}
                    />
                  </div>
                </div>

                {/* Fabric type/price pairs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Fabric Pricing</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      disabled={pending}
                      onClick={() => addFabricPair(mi)}
                    >
                      <Plus className="mr-1 size-3" />
                      Add
                    </Button>
                  </div>
                  {model.fabricsType.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No fabric pricing entries.
                    </p>
                  )}
                  {model.fabricsType.map((_, fi) => (
                    <div key={fi} className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Input
                          value={model.fabricsType[fi]}
                          onChange={(e) =>
                            updateFabricType(mi, fi, e.target.value)
                          }
                          placeholder="e.g. LLL"
                          disabled={pending}
                        />
                      </div>
                      <div className="w-28 space-y-1">
                        <Label className="text-xs">Price</Label>
                        <Input
                          type="number"
                          value={model.fabricsPrice[fi]}
                          onChange={(e) =>
                            updateFabricPrice(
                              mi,
                              fi,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          disabled={pending}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={pending}
                        onClick={() => removeFabricPair(mi, fi)}
                      >
                        <X className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Material type/price pairs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Material Pricing</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      disabled={pending}
                      onClick={() => addMaterialPair(mi)}
                    >
                      <Plus className="mr-1 size-3" />
                      Add
                    </Button>
                  </div>
                  {model.materialType.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No material pricing entries.
                    </p>
                  )}
                  {model.materialType.map((_, mi2) => (
                    <div key={mi2} className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Input
                          value={model.materialType[mi2]}
                          onChange={(e) =>
                            updateMaterialType(mi, mi2, e.target.value)
                          }
                          placeholder="e.g. Oak"
                          disabled={pending}
                        />
                      </div>
                      <div className="w-28 space-y-1">
                        <Label className="text-xs">Price</Label>
                        <Input
                          type="number"
                          value={model.materialPrice[mi2]}
                          onChange={(e) =>
                            updateMaterialPrice(
                              mi,
                              mi2,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          disabled={pending}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={pending}
                        onClick={() => removeMaterialPair(mi, mi2)}
                      >
                        <X className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
