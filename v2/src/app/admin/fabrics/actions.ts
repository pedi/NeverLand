"use server";

import { revalidatePath } from "next/cache";
import { adminDb, adminStorage } from "@/lib/firebase-admin";

const BUCKET_NAME = "neverland-d65b3.firebasestorage.app";

export async function addFabric(formData: FormData) {
  const name = formData.get("name") as string;
  const priceGroup = formData.get("priceGroup") as string;
  const type = formData.get("type") as string;
  const imageFile = formData.get("image") as File;

  if (!name || !priceGroup || !type || !imageFile) {
    throw new Error("All fields are required");
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const fileName = `fabrics/${Date.now()}-${imageFile.name}`;
  const bucket = adminStorage.bucket();
  const file = bucket.file(`images/${fileName}`);

  await file.save(buffer, { contentType: imageFile.type });
  await file.makePublic();

  const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/images/${fileName}`;

  await adminDb.collection("fabrics").add({
    name,
    priceGroup,
    type,
    imageUrl,
  });

  revalidatePath("/admin/fabrics");
}

export async function deleteFabric(id: string) {
  await adminDb.collection("fabrics").doc(id).delete();
  revalidatePath("/admin/fabrics");
}
