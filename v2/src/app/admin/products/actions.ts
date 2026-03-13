"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import type { ProductImage, ProductModel } from "@/lib/types";

const BUCKET_NAME = "neverland-d65b3.firebasestorage.app";

async function uploadFile(file: File): Promise<string> {
  const bucket = adminStorage.bucket();
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const fileRef = bucket.file(filename);

  await fileRef.save(buffer, {
    metadata: { contentType: file.type },
  });
  await fileRef.makePublic();

  return `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
}

function parseFormFields(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const subcategory = formData.get("subcategory") as string;
  const newArrival = formData.get("newArrival") === "true";
  const smallLot = formData.get("smallLot") === "true";
  const deliveryTime = (formData.get("deliveryTime") as string) || "";
  const batchRatio = parseFloat(formData.get("batchRatio") as string) || 0;
  const batchThreshold =
    parseFloat(formData.get("batchThreshold") as string) || 0;
  const downloadLink = (formData.get("downloadLink") as string) || "";
  const models: ProductModel[] = JSON.parse(
    (formData.get("models") as string) || "[]"
  );

  return {
    name,
    description,
    category,
    subcategory,
    newArrival,
    smallLot,
    deliveryTime,
    batchRatio,
    batchThreshold,
    downloadLink,
    models,
  };
}

export async function createProduct(formData: FormData) {
  const fields = parseFormFields(formData);

  const imageFiles = formData.getAll("images") as File[];
  const images: ProductImage[] = [];
  for (const file of imageFiles) {
    if (file.size > 0) {
      const url = await uploadFile(file);
      images.push({ url, contentType: file.type, thumbnailUrl: url });
    }
  }

  let availableSizesImage = "";
  const sizesFile = formData.get("availableSizesImage") as File | null;
  if (sizesFile && sizesFile.size > 0) {
    availableSizesImage = await uploadFile(sizesFile);
  }

  await adminDb.collection("products").add({
    ...fields,
    images,
    availableSizesImage,
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const fields = parseFormFields(formData);

  const existingImages: ProductImage[] = JSON.parse(
    (formData.get("existingImages") as string) || "[]"
  );

  const imageFiles = formData.getAll("images") as File[];
  const newImages: ProductImage[] = [];
  for (const file of imageFiles) {
    if (file.size > 0) {
      const url = await uploadFile(file);
      newImages.push({ url, contentType: file.type, thumbnailUrl: url });
    }
  }

  let availableSizesImage =
    (formData.get("existingAvailableSizesImage") as string) || "";
  const sizesFile = formData.get("availableSizesImage") as File | null;
  if (sizesFile && sizesFile.size > 0) {
    availableSizesImage = await uploadFile(sizesFile);
  }

  await adminDb
    .collection("products")
    .doc(id)
    .update({
      ...fields,
      images: [...existingImages, ...newImages],
      availableSizesImage,
    });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await adminDb.collection("products").doc(id).delete();
  revalidatePath("/admin/products");
}

export async function deleteProductImage(
  productId: string,
  imageIndex: number
) {
  const doc = await adminDb.collection("products").doc(productId).get();
  if (!doc.exists) throw new Error("Product not found");

  const images: ProductImage[] = doc.data()?.images || [];
  images.splice(imageIndex, 1);

  await adminDb.collection("products").doc(productId).update({ images });
  revalidatePath("/admin/products");
}
