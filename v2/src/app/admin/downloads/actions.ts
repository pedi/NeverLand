"use server";

import { revalidatePath } from "next/cache";
import { adminDb, adminStorage } from "@/lib/firebase-admin";

const BUCKET_NAME = "neverland-d65b3.firebasestorage.app";

export async function addDownloadable(formData: FormData) {
  const name = formData.get("name") as string;
  const downloadLink = formData.get("downloadLink") as string;
  const imageFile = formData.get("image") as File;

  if (!name || !downloadLink || !imageFile) {
    throw new Error("All fields are required");
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const fileName = `downloadables/${Date.now()}-${imageFile.name}`;
  const bucket = adminStorage.bucket();
  const file = bucket.file(`images/${fileName}`);

  await file.save(buffer, { contentType: imageFile.type });
  await file.makePublic();

  const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/images/${fileName}`;

  await adminDb.collection("downloadables").add({
    name,
    downloadLink,
    imageUrl,
  });

  revalidatePath("/admin/downloads");
}

export async function deleteDownloadable(id: string) {
  await adminDb.collection("downloadables").doc(id).delete();
  revalidatePath("/admin/downloads");
}
