"use server";

import { revalidatePath } from "next/cache";
import { adminDb, adminStorage } from "@/lib/firebase-admin";

const BUCKET_NAME = "neverland-d65b3.firebasestorage.app";

export async function addMaterial(formData: FormData) {
  const name = formData.get("name") as string;
  const priceGroup = formData.get("priceGroup") as string;
  const imageFile = formData.get("image") as File;

  if (!name || !priceGroup || !imageFile) {
    throw new Error("All fields are required");
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const fileName = `materials/${Date.now()}-${imageFile.name}`;
  const bucket = adminStorage.bucket();
  const file = bucket.file(`images/${fileName}`);

  await file.save(buffer, { contentType: imageFile.type });
  await file.makePublic();

  const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/images/${fileName}`;

  await adminDb.collection("materials").add({
    name,
    priceGroup,
    imageUrl,
  });

  revalidatePath("/admin/materials");
}

export async function deleteMaterial(id: string) {
  await adminDb.collection("materials").doc(id).delete();
  revalidatePath("/admin/materials");
}
