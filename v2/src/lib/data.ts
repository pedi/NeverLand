import { adminDb } from "./firebase-admin";
import type {
  Category,
  Product,
  Banner,
  Fabric,
  Material,
  Intro,
  Downloadable,
} from "./types";

export async function getCategories(): Promise<Category[]> {
  const snapshot = await adminDb.collection("categories").get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Category)
    .filter((c) => !c.deleted)
    .map((c) => ({
      ...c,
      subcategories: (c.subcategories || []).filter((s) => !s.deleted),
    }));
}

export async function getAllCategories(): Promise<Category[]> {
  const snapshot = await adminDb.collection("categories").get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Category
  );
}

export async function getBanners(): Promise<Banner[]> {
  const snapshot = await adminDb.collection("banners").get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Banner
  );
}

export async function getProducts(): Promise<Product[]> {
  const snapshot = await adminDb.collection("products").get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Product
  );
}

export async function getProduct(id: string): Promise<Product | null> {
  const doc = await adminDb.collection("products").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Product;
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const snapshot = await adminDb
    .collection("products")
    .where("category", "==", categoryId)
    .get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
    .filter((p) => !p.smallLot);
}

export async function getProductsBySubcategory(
  subcategoryId: string
): Promise<Product[]> {
  const snapshot = await adminDb
    .collection("products")
    .where("subcategory", "==", subcategoryId)
    .get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
    .filter((p) => !p.smallLot);
}

export async function getNewArrivals(): Promise<Product[]> {
  const snapshot = await adminDb
    .collection("products")
    .where("newArrival", "==", true)
    .get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
    .filter((p) => !p.smallLot);
}

export async function getSmallLot(): Promise<Product[]> {
  const snapshot = await adminDb
    .collection("products")
    .where("smallLot", "==", true)
    .get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Product
  );
}

export async function getFabrics(priceGroups?: string[]): Promise<Fabric[]> {
  let query: FirebaseFirestore.Query = adminDb.collection("fabrics");
  if (priceGroups && priceGroups.length > 0) {
    query = query.where("priceGroup", "in", priceGroups);
  }
  const snapshot = await query.get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Fabric
  );
}

export async function getMaterials(
  priceGroups?: string[]
): Promise<Material[]> {
  let query: FirebaseFirestore.Query = adminDb.collection("materials");
  if (priceGroups && priceGroups.length > 0) {
    query = query.where("priceGroup", "in", priceGroups);
  }
  const snapshot = await query.get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Material
  );
}

export async function getIntro(type: string): Promise<Intro | null> {
  const doc = await adminDb.collection("intros").doc(type).get();
  if (!doc.exists) return null;
  return doc.data() as Intro;
}

export async function getDownloadables(): Promise<Downloadable[]> {
  const snapshot = await adminDb.collection("downloadables").get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Downloadable
  );
}

export async function searchProducts(keyword: string): Promise<Product[]> {
  const snapshot = await adminDb.collection("products").get();
  const lower = keyword.toLowerCase();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
    .filter((p) => p.name.toLowerCase().includes(lower));
}
