"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AuthContextProvider } from "@/context/authcontext";
import FavoriteButton from "../FavoriteButton";
import AddToCartButton from "@/app/(pages)/products/[productId]/components/AddtoCart";
import { RatingReview } from "./RatingReview";

const hopTransition = {
  duration: 0.6,
  ease: [0.9, 0, 0.1, 1],
};

export default function ProductsGridView({ products }: any) {
  return (
    <section className="w-full flex justify-center px-4 sm:px-6 md:px-8">
      <div className="flex flex-col gap-8 max-w-[100rem] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((item: any) => (
            <ProductCard product={item} key={item?.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={hopTransition}
      className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.015] transition-all duration-300 overflow-hidden flex flex-col group relative"
    >
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] overflow-hidden">
        <Link href={`/products/${product?.id}`}>
          <Image
            src={product?.featureImageURL}
            alt={product?.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute top-2 right-2 z-10">
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>

        {product?.stock <= (product?.orders ?? 0) && (
          <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow">
            Out of Stock
          </div>
        )}

        <Link
          href={`/checkout?type=buynow&productId=${product?.id}`}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto"
        >
          <button className="w-full border h-[50px] rounded-full cursor-pointer border-white hover:border-black text-black text-xs bg-white hover:bg-black hover:text-white transition-all duration-300">
            Buy Now
          </button>
        </Link>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h1 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product?.title}
        </h1>
        <p className="text-xs text-gray-500 line-clamp-2">
          {product?.shortDescription}
        </p>

        <div className="flex items-center gap-2">
          <h2 className="text-green-600 font-bold text-sm">
            ₹ {product?.saleprice}
          </h2>
          <span className="line-through text-xs text-gray-400">
            ₹ {product?.price}
          </span>
        </div>

        <RatingReview product={product} />
      </div>

      <div className="px-4 pb-4 flex gap-2 mt-auto">
        <AuthContextProvider>
          <AddToCartButton productId={product?.id} />
        </AuthContextProvider>
      </div>
    </motion.div>
  );
}
