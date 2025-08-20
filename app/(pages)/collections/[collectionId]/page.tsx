"use server";

import { ProductCard } from "@/app/components/home/Product";
import { getCollection } from "@/lib/firebase/collections/read_server";
import { getProduct } from "@/lib/firebase/products/read_server";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";

interface PageParams {
  params: {
    collectionId: string;
  };
}

export type Product = {
  id: string;
  title: string;
  imageURL: string;
  price: number;
};

export async function generateMetadata(
  { params }: PageParams,
  _parent?: ResolvingMetadata
): Promise<Metadata> {
  const { collectionId } = params;
  const collection = await getCollection({ id: collectionId });

  return {
    title: `${collection?.title ?? "Collection"} | Collection`,
    description: collection?.subtitle ?? "",
    openGraph: {
      images: collection?.imageURL ? [collection.imageURL] : [],
    },
  };
}

export default async function Page({ params }: PageParams) {
  const collection = await getCollection({ id: params.collectionId });

  if (!collection) {
    return (
      <main className="flex justify-center items-center p-10">
        <p className="text-gray-500 text-lg">Collection not found.</p>
      </main>
    );
  }

  const products: Product[] = await Promise.all(
    (collection.products ?? []).map(async (id: string) => {
      const product = await getProduct({ id });
      return product!;
    })
  );

  return (
    <main className="flex justify-center w-full">
      <div className="flex flex-col gap-10 w-full max-w-[100rem]">
        {/* Hero Banner */}
        <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg">
          {collection.imageURL && (
            <Image
              src={collection.imageURL}
              alt={collection.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end items-center text-center p-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">
              {collection.title}
            </h1>
            <p className="text-gray-200 mt-2 max-w-2xl">
              {collection.subtitle}
            </p>
          </div>
        </div>

        {/* Products Section */}
        <section className="px-4 md:px-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Explore Our Collection
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(
                (product) =>
                  product && (
                    <div
                      key={product.id}
                      className="transform hover:scale-[1.02] transition-transform duration-300"
                    >
                      <ProductCard product={product} />
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No products available in this collection.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
