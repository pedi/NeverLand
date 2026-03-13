import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import type { UserProfile } from "@/lib/types";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;

  if (!session) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    const snap = await adminDb.collection("users").doc(decoded.uid).get();
    const profile = snap.exists ? (snap.data() as UserProfile) : null;

    return { user: decoded, profile };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const result = await getCurrentUser();

  if (!result?.profile?.superUser) {
    redirect("/login");
  }

  return result;
}
