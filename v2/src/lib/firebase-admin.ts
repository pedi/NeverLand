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
  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credentialPath) {
    // When GOOGLE_APPLICATION_CREDENTIALS points to a service account JSON file,
    // the Admin SDK picks it up automatically via application default credentials.
    initializeApp({
      storageBucket: "neverland-d65b3.firebasestorage.app",
    });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount: ServiceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    );
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "neverland-d65b3.firebasestorage.app",
    });
  } else {
    // Fallback: works in Google Cloud environments with default credentials
    initializeApp({
      projectId: "neverland-d65b3",
      storageBucket: "neverland-d65b3.firebasestorage.app",
    });
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();
