import { ProductCard } from "@/app/components/home/Product";
import { getCatergory } from "@/lib/firebase/catergories/read_server";
import { getProductsByCategory } from "@/lib/firebase/products/read_server";
import Image from "next/image";

export async function generateMetadata({ params }: any) {
  const { categoryId } = params;
  const category = await getCatergory({ id: categoryId });

  return {
    title: `${category?.name} | Category`,
    openGraph: {
      images: [category?.imageURL],
    },
  };
}

export default async function Page({ params }: any) {
  const { categoryId } = params;
  const category = await getCatergory({ id: categoryId });
  const products = await getProductsByCategory({ catergoryId: categoryId });
  return (
    <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
      <div className="flex flex-col gap-6 max-w-[100rem] p-5">
        <p className="text-2xl mb-5 text-center sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl italic font-serif text-gray-700 mt-4">
          {category?.name}{" "}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-self-center justify-center items-center gap-4 md:gap-5">
          {products?.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
        </div>
      </div>
    </main>
  );
}
