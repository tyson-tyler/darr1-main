import algoliasearch from "algoliasearch";
import SearchBox from "./components/searchBox";

const getProducts = async (text: string) => {
  if (!text) return [];

  try {
    const client = algoliasearch(
      process.env.ALGOLIA_APP_ID!,       // must exist in Vercel env
      process.env.ALGOLIA_ADMIN_KEY!     // must exist in Vercel env
    );

    const search = await client.search([
      {
        indexName: "products",
        query: text,
        hitsPerPage: 20,
      },
    ]);

    return search.results[0]?.hits ?? [];
  } catch (err) {
    console.error("Algolia search failed:", err);
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
    <main className="flex flex-col gap-6 min-h-screen pt-[100px] p-5">
      <SearchBox />

      {q ? (
        products.length > 0 ? (
          <div>
            <h1 className="text-center font-semibold text-2xl mb-4">
              Products for "{q}"
            </h1>
            <pre className="text-xs bg-gray-100 p-4 rounded max-w-full overflow-x-auto">
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 text-lg font-medium">
              ❌ No products found for "{q}"
            </p>
          </div>
        )
      ) : (
        <p className="text-gray-400 text-center">🔍 Type something to search.</p>
      )}
    </main>
  );
}
