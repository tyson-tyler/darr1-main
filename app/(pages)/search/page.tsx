import { ProductCard } from "@/app/components/home/Product";
import { algoliasearch } from "algoliasearch";
import SearchBox from "./components/searchBox";

const getProducts = async (text) => {
  if (!text) {
    return [];
  }
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY
  );
  const search = await client.searchForHits({
    requests: [
      {
        indexName: "products",
        query: text,
        hitsPerPage: 20,
      },
    ],
  });
  const hits = search.results[0]?.hits;
  return hits ?? [];
};

export default async function Page({ searchParams }) {
  const { q } = searchParams;
  const products = await getProducts(q);
  return (
    <main className="flex flex-col gap-1 min-h-screen pt-[100px]">
      <SearchBox />
      <div className="flex flex-col gap-1 justify-center items-center"></div>
      {products?.length != 0 && (
        <div className="w-full flex justify-center">
          <div className="flex flex-col gap-5 max-w-[100rem] w-full  p-5">
            <h1 className="text-center font-semibold text-2xl">
              Products for {q}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products?.map((item) => {
                return <ProductCard product={item} key={item?.id} />;
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
