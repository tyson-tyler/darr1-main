import { ProductCard } from "@/app/components/home/Product";
import { db } from "@/lib/firebase"; // make sure your Firestore is exported from here
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import SearchBox from "./components/searchBox";

const getProducts = async (text: string) => {
  if (!text) return [];

  try {
    const productsRef = collection(db, "products");

    // 🔍 Search in "title" field (case-sensitive by default)
    const q = query(
      productsRef,
      where("title", ">=", text),
      where("title", "<=", text + "\uf8ff")
    );

    const snapshot = await getDocs(q);

    const products: any[] = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (err) {
    console.error("Firestore search error:", err);
    return [];
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = searchParams?.q ?? "";
  const products = await getProducts(q);

  return (
    <main className="flex flex-col gap-1 min-h-screen pt-[100px]">
      <SearchBox />

      {products.length > 0 ? (
        <div className="w-full flex justify-center">
          <div className="flex flex-col gap-5 max-w-[100rem] w-full p-5">
            <h1 className="text-center font-semibold text-2xl">
              Products for "{q}"
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))}
            </div>
          </div>
        </div>
      ) : q ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg font-medium">
            ❌ No products found for "{q}"
          </p>
        </div>
      ) : (
        <p className="text-gray-400 text-center">🔍 Type something to search.</p>
      )}
    </main>
  );
}
