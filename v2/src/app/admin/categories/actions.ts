"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function updateCategory(
  id: string,
  data: { name?: string; displayName?: string }
) {
  await adminDb.collection("categories").doc(id).update(data);
  revalidatePath("/admin/categories");
}

export async function toggleCategoryDelete(id: string) {
  const doc = await adminDb.collection("categories").doc(id).get();
  if (!doc.exists) throw new Error("Category not found");
  const deleted = doc.data()?.deleted ?? false;
  await adminDb.collection("categories").doc(id).update({ deleted: !deleted });
  revalidatePath("/admin/categories");
}

export async function addCategory(name: string, displayName: string) {
  await adminDb.collection("categories").add({
    name,
    displayName,
    deleted: false,
    subcategories: [],
  });
  revalidatePath("/admin/categories");
}

export async function addSubcategory(categoryId: string, name: string) {
  const sub = { id: name, name, deleted: false };
  await adminDb
    .collection("categories")
    .doc(categoryId)
    .update({
      subcategories: FieldValue.arrayUnion(sub),
    });
  revalidatePath("/admin/categories");
}

export async function toggleSubcategoryDelete(
  categoryId: string,
  subId: string
) {
  const doc = await adminDb.collection("categories").doc(categoryId).get();
  if (!doc.exists) throw new Error("Category not found");
  const subs: { id: string; name: string; deleted: boolean }[] =
    doc.data()?.subcategories ?? [];
  const updated = subs.map((s) =>
    s.id === subId ? { ...s, deleted: !s.deleted } : s
  );
  await adminDb
    .collection("categories")
    .doc(categoryId)
    .update({ subcategories: updated });
  revalidatePath("/admin/categories");
}

export async function renameSubcategory(
  categoryId: string,
  subId: string,
  name: string
) {
  const doc = await adminDb.collection("categories").doc(categoryId).get();
  if (!doc.exists) throw new Error("Category not found");
  const subs: { id: string; name: string; deleted: boolean }[] =
    doc.data()?.subcategories ?? [];
  const updated = subs.map((s) => (s.id === subId ? { ...s, name } : s));
  await adminDb
    .collection("categories")
    .doc(categoryId)
    .update({ subcategories: updated });
  revalidatePath("/admin/categories");
}
