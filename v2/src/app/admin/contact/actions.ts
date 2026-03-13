"use server";

import { revalidatePath } from "next/cache";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const BUCKET_NAME = "neverland-d65b3.firebasestorage.app";

export async function updateIntro(type: string, content: string) {
  await adminDb.collection("intros").doc(type).set({ content }, { merge: true });
  revalidatePath(`/admin/${type}`);
}

export async function addIntroImage(type: string, formData: FormData) {
  const imageFile = formData.get("image") as File;

  if (!imageFile) {
    throw new Error("Image is required");
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const fileName = `intros/${type}/${Date.now()}-${imageFile.name}`;
  const bucket = adminStorage.bucket();
  const file = bucket.file(`images/${fileName}`);

  await file.save(buffer, { contentType: imageFile.type });
  await file.makePublic();

  const url = `https://storage.googleapis.com/${BUCKET_NAME}/images/${fileName}`;

  await adminDb
    .collection("intros")
    .doc(type)
    .set(
      {
        images: FieldValue.arrayUnion({
          url,
          contentType: imageFile.type,
        }),
      },
      { merge: true }
    );

  revalidatePath(`/admin/${type}`);
}

export async function deleteIntroImage(type: string, imageIndex: number) {
  const doc = await adminDb.collection("intros").doc(type).get();
  if (!doc.exists) throw new Error("Intro not found");

  const images: { url: string; contentType: string }[] = doc.data()?.images ?? [];
  images.splice(imageIndex, 1);

  await adminDb.collection("intros").doc(type).update({ images });
  revalidatePath(`/admin/${type}`);
}
