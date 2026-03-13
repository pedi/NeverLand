import {
  initializeApp,
  getApps,
  cert,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount: ServiceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    );
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "neverland-d65b3.firebasestorage.app",
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
      storageBucket: "neverland-d65b3.firebasestorage.app",
    });
  } else {
    initializeApp({
      projectId: "neverland-d65b3",
      storageBucket: "neverland-d65b3.firebasestorage.app",
    });
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();
