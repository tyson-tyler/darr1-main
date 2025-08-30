// lib/firebase/products/read_server.ts
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// Get single product
export const getProduct = async ({ id }: { id: string }) => {
  try {
    const snap = await getDoc(doc(db, "products", id));

    if (!snap.exists()) {
      console.warn("⚠️ Product not found:", id);
      return null;
    }

    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("❌ getProduct failed:", err);
    return null;
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isFeatured", "==", true))
  );
  return list.docs.map((snap) => ({ id: snap.id, ...snap.data() }));
};

// Get all products
export const getProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  return list.docs.map((snap) => ({ id: snap.id, ...snap.data() }));
};

// Get products by category
export const getProductsByCategory = async ({ categoryId }: { categoryId: string }) => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      where("categoryId", "==", categoryId)
    )
  );
  return list.docs.map((snap) => ({ id: snap.id, ...snap.data() }));
};
