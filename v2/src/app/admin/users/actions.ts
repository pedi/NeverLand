"use server";

import { revalidatePath } from "next/cache";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function addUser(username: string, password: string, superUser: boolean) {
  const email = `${username}@neverland.com`;

  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: username,
  });

  await adminDb.collection("users").doc(userRecord.uid).set({
    username,
    email,
    superUser,
    checkPrice: false,
    remark: "",
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(uid: string) {
  try {
    await adminAuth.deleteUser(uid);
  } catch {
    // user may already be deleted from Auth
  }
  await adminDb.collection("users").doc(uid).delete();
  revalidatePath("/admin/users");
}

export async function updateUserPassword(uid: string, newPassword: string) {
  await adminAuth.updateUser(uid, { password: newPassword });
}
