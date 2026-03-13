"use server";

import { revalidatePath } from "next/cache";
import { adminDb, adminStorage } from "@/lib/firebase-admin";

const BUCKET_NAME = "neverland-d65b3.firebasestorage.app";

export async function addBanner(formData: FormData) {
  const imageFile = formData.get("image") as File;

  if (!imageFile) {
    throw new Error("Image is required");
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const fileName = `banners/${Date.now()}-${imageFile.name}`;
  const bucket = adminStorage.bucket();
  const file = bucket.file(`images/${fileName}`);

  await file.save(buffer, { contentType: imageFile.type });
  await file.makePublic();

  const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/images/${fileName}`;

  await adminDb.collection("banners").add({ imageUrl });
  revalidatePath("/admin/banners");
}

export async function deleteBanner(id: string) {
  await adminDb.collection("banners").doc(id).delete();
  revalidatePath("/admin/banners");
}
