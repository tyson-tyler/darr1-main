import algoliasearch from "algoliasearch";
import SearchBox from "./components/searchBox";
import ProductCard from "@/app/components/home/ProductCard"; // ✅ make sure file exists

// Fetch products from Algolia
const getProducts = async (text: string) => {
  if (!text) return [];

  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID!,       // ✅ Server-side env vars
    process.env.ALGOLIA_ADMIN_KEY!     // ✅ Use Admin key for server
  );

  const search = await client.search([
    {
      indexName: "products",
      query: text,
      hitsPerPage: 20,
    },
  ]);

  return search.results[0]?.hits ?? [];
};

export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const { q } = searchParams;
  const products = await getProducts(q ?? "");

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
              {products.map((item: any) => (
                <ProductCard product={item} key={item.objectID} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        q && (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 text-lg font-medium">
              ❌ No products found for "{q}"
            </p>
          </div>
        )
      )}
    </main>
  );
}
