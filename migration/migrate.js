const admin = require("firebase-admin");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const SERVICE_ACCOUNT = require("../neverland-d65b3-firebase-adminsdk-fbsvc-a312f888f9.json");
const MONGO_URI = "mongodb://127.0.0.1/NeverLand";
const IMAGES_DIR = path.join(__dirname, "..", "images");
const STORAGE_BUCKET = "neverland-d65b3.firebasestorage.app";

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT),
  storageBucket: STORAGE_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const auth = admin.auth();

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function uploadImage(localPath) {
  const fullPath = path.join(IMAGES_DIR, "..", localPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  [SKIP] File not found: ${fullPath}`);
    return null;
  }
  const destination = `images/${path.basename(localPath)}`;
  try {
    await bucket.upload(fullPath, {
      destination,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
    const file = bucket.file(destination);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "2030-01-01",
    });
    console.log(`  [OK] Uploaded ${localPath} -> ${destination}`);
    return url;
  } catch (err) {
    console.error(`  [ERR] Failed to upload ${localPath}: ${err.message}`);
    return null;
  }
}

async function makePublicUrl(localPath) {
  const fullPath = path.join(IMAGES_DIR, "..", localPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  [SKIP] File not found: ${fullPath}`);
    return null;
  }
  const destination = `images/${path.basename(localPath)}`;
  try {
    await bucket.upload(fullPath, {
      destination,
      metadata: { cacheControl: "public, max-age=31536000" },
      public: true,
    });
    const url = `https://storage.googleapis.com/${STORAGE_BUCKET}/${destination}`;
    console.log(`  [OK] ${localPath}`);
    return url;
  } catch (err) {
    console.error(`  [ERR] Failed to upload ${localPath}: ${err.message}`);
    return null;
  }
}

async function migrateCategories() {
  console.log("\n=== Migrating Categories ===");
  const Category = mongoose.model(
    "Category",
    new mongoose.Schema({}, { strict: false, collection: "categories" })
  );
  const SubCategory = mongoose.model(
    "SubCategory",
    new mongoose.Schema({}, { strict: false, collection: "subcategories" })
  );

  const categories = await Category.find().lean();
  const subcategories = await SubCategory.find().lean();
  const subMap = {};
  for (const sub of subcategories) {
    subMap[sub._id.toString()] = sub;
  }

  for (const cat of categories) {
    const subs = (cat.subcategories || []).map((subId) => {
      const sub = subMap[subId.toString()];
      if (!sub) return null;
      return {
        id: sub._id.toString(),
        name: sub.name,
        deleted: sub.deleted || false,
      };
    }).filter(Boolean);

    await db.collection("categories").doc(cat._id.toString()).set({
      name: cat.name,
      displayName: cat.displayName || null,
      deleted: cat.deleted || false,
      subcategories: subs,
    });
    console.log(`  Category: ${cat.displayName || cat.name} (${subs.length} subcategories)`);
  }

  // Also store subcategories as separate collection for product references
  for (const sub of subcategories) {
    await db.collection("subcategories").doc(sub._id.toString()).set({
      name: sub.name,
      deleted: sub.deleted || false,
    });
  }
  console.log(`  Total: ${categories.length} categories, ${subcategories.length} subcategories`);
}

async function migrateProducts() {
  console.log("\n=== Migrating Products ===");
  const Product = mongoose.model(
    "Product",
    new mongoose.Schema({}, { strict: false, collection: "products" })
  );
  const products = await Product.find().lean();
  console.log(`  Found ${products.length} products`);

  for (const product of products) {
    const images = [];
    for (const img of product.images || []) {
      const url = await makePublicUrl(img.path);
      if (url) images.push({ url, contentType: img.content_type });
      // Also upload thumbnail if it exists
      const thumbPath = img.path + "_thumbnail";
      const thumbUrl = await makePublicUrl(thumbPath);
      if (thumbUrl) {
        images[images.length - 1].thumbnailUrl = thumbUrl;
      }
    }

    let availableSizesImageUrl = null;
    if (product.available_sizes_image && product.available_sizes_image.path) {
      availableSizesImageUrl = await makePublicUrl(product.available_sizes_image.path);
    }

    await db.collection("products").doc(product._id.toString()).set({
      name: product.name || "",
      description: product.description || "",
      category: product.category ? product.category.toString() : null,
      subcategory: product.subcategory ? product.subcategory.toString() : null,
      images,
      availableSizesImage: availableSizesImageUrl,
      models: (product.models || []).map((m) => ({
        name: m.name || "",
        volume: m.volume || "",
        fabricsType: m.fabrics_type || [],
        fabricsPrice: m.fabrics_price || [],
        materialType: m.material_type || [],
        materialPrice: m.material_price || [],
      })),
      batchRatio: product.batch_ratio || null,
      batchThreshold: product.batch_threshold || null,
      deliveryTime: product.delivery_time || null,
      downloadLink: product.download_link || null,
      newArrival: product.new_arrival || false,
      smallLot: product.small_lot || false,
    });
    console.log(`  Product: ${product.name}`);
  }
}

async function migrateFabrics() {
  console.log("\n=== Migrating Fabrics ===");
  const Fabric = mongoose.model(
    "Fabrics",
    new mongoose.Schema({}, { strict: false, collection: "fabrics" })
  );
  const fabrics = await Fabric.find().lean();

  for (const fabric of fabrics) {
    let imageUrl = null;
    if (fabric.image && fabric.image.path) {
      imageUrl = await makePublicUrl(fabric.image.path);
    }
    await db.collection("fabrics").doc(fabric._id.toString()).set({
      name: fabric.name || "",
      priceGroup: fabric.price_group || "",
      type: fabric.type || "",
      imageUrl,
    });
    console.log(`  Fabric: ${fabric.name}`);
  }
}

async function migrateMaterials() {
  console.log("\n=== Migrating Materials ===");
  const Material = mongoose.model(
    "Material",
    new mongoose.Schema({}, { strict: false, collection: "materials" })
  );
  const materials = await Material.find().lean();

  for (const material of materials) {
    let imageUrl = null;
    if (material.image && material.image.path) {
      imageUrl = await makePublicUrl(material.image.path);
    }
    await db.collection("materials").doc(material._id.toString()).set({
      name: material.name || "",
      priceGroup: material.price_group || "",
      imageUrl,
    });
    console.log(`  Material: ${material.name}`);
  }
}

async function migrateBanners() {
  console.log("\n=== Migrating Banners ===");
  const Banner = mongoose.model(
    "Banner",
    new mongoose.Schema({}, { strict: false, collection: "banners" })
  );
  const banners = await Banner.find().lean();

  for (const banner of banners) {
    let imageUrl = null;
    if (banner.image && banner.image.path) {
      imageUrl = await makePublicUrl(banner.image.path);
    }
    await db.collection("banners").doc(banner._id.toString()).set({
      imageUrl,
    });
    console.log(`  Banner: ${banner._id}`);
  }
}

async function migrateDownloadables() {
  console.log("\n=== Migrating Downloadables ===");
  const Downloadable = mongoose.model(
    "Downloadable",
    new mongoose.Schema({}, { strict: false, collection: "downloadables" })
  );
  const downloads = await Downloadable.find().lean();

  for (const dl of downloads) {
    let imageUrl = null;
    if (dl.image && dl.image.path) {
      imageUrl = await makePublicUrl(dl.image.path);
    }
    await db.collection("downloadables").doc(dl._id.toString()).set({
      name: dl.name || "",
      downloadLink: dl.download_link || "",
      imageUrl,
    });
    console.log(`  Download: ${dl.name}`);
  }
}

async function migrateIntros() {
  console.log("\n=== Migrating Intros (About/Contact) ===");
  const Intro = mongoose.model(
    "Intro",
    new mongoose.Schema({}, { strict: false, collection: "intros" })
  );
  const intros = await Intro.find().lean();

  for (const intro of intros) {
    const images = [];
    for (const img of intro.images || []) {
      const url = await makePublicUrl(img.path);
      if (url) images.push({ url, contentType: img.content_type });
    }
    await db.collection("intros").doc(intro.type || intro._id.toString()).set({
      type: intro.type || "",
      content: intro.content || "",
      images,
    });
    console.log(`  Intro: ${intro.type}`);
  }
}

async function migrateUsers() {
  console.log("\n=== Migrating Users to Firebase Auth ===");
  const User = mongoose.model(
    "User",
    new mongoose.Schema({}, { strict: false, collection: "users" })
  );
  const users = await User.find().lean();

  for (const user of users) {
    if (!user.username) continue;
    const email = `${user.username}@neverland.asia`;
    try {
      const authUser = await auth.createUser({
        email,
        password: "ChangeMeNow123!",
        displayName: user.username,
      });
      await db.collection("users").doc(authUser.uid).set({
        username: user.username,
        email,
        superUser: user.super_user || false,
        checkPrice: user.check_price || false,
        remark: user.remark || "",
        mongoId: user._id.toString(),
      });
      console.log(`  User: ${user.username} -> ${email} (${authUser.uid})${user.super_user ? " [ADMIN]" : ""}`);
    } catch (err) {
      console.error(`  [ERR] User ${user.username}: ${err.message}`);
    }
  }
  console.log("\n  NOTE: All users have temporary password 'ChangeMeNow123!' - change immediately!");
}

async function main() {
  console.log("=========================================");
  console.log(" NeverLand Migration: MongoDB -> Firebase");
  console.log("=========================================");

  try {
    await migrateCategories();
    await migrateBanners();
    await migrateFabrics();
    await migrateMaterials();
    await migrateDownloadables();
    await migrateIntros();
    await migrateProducts();
    await migrateUsers();

    console.log("\n=========================================");
    console.log(" Migration Complete!");
    console.log("=========================================");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
