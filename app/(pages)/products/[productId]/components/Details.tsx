"use client";

import { useState } from "react";
import FavoriteButton from "@/app/components/FavoriteButton";
import { AuthContextProvider } from "@/context/authcontext";
import { getProductReviewCounts } from "@/lib/firebase/products/count/read";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AddToCartButton from "./AddtoCart";
import { applyCouponToProduct } from "@/lib/firebase/products/applyCouponToProduct";

export default function Details({ product }: any) {
  if (!product) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Product details could not be loaded.
      </div>
    );
  }

  const isOutOfStock = product?.stock <= (product?.orders ?? 0);

  // --- Coupon State ---
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [appliedPrice, setAppliedPrice] = useState(product?.saleprice);

  // --- Apply Coupon ---
  const handleApplyCoupon = async () => {
    setError("");

    if (!product?.id) {
      setError("Product not found.");
      return;
    }

    const res = await applyCouponToProduct(product.id, coupon);

    if (res.success && res.newPrice) {
      setAppliedPrice(res.newPrice);
    } else {
      setError(res.error || "Failed to apply coupon");
      setAppliedPrice(product?.saleprice);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 md:p-6 lg:p-8 bg-white rounded-lg ">
      {/* Product Title */}
      <h1 className="font-extrabold text-2xl md:text-5xl text-gray-900 leading-tight">
        {product?.title}
      </h1>

      {/* Rating & Reviews */}
      <Suspense
        fallback={
          <div className="h-5 w-32 bg-gray-100 rounded-md animate-pulse"></div>
        }
      >
        <RatingReview product={product} />
      </Suspense>

      {/* Short Description */}
      <p className="text-gray-600 text-base md:text-lg line-clamp-3 md:line-clamp-4 leading-relaxed">
        {product?.shortDescription}
      </p>

      {/* Price Information */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h3 className="text-green-600 font-bold text-2xl md:text-4xl">
            ₹ {appliedPrice.toLocaleString("en-IN")}
          </h3>
          {product?.price && product?.price > appliedPrice && (
            <span className="line-through text-gray-500 text-base md:text-xl">
              ₹ {product?.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Coupon Applied */}
      
      </div>

      {/* Coupon Input */}
    
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 py-2">
        <Link href={`/checkout?type=buynow&productId=${product?.id}`} passHref>
          <button
            className="flex-1 w-full sm:w-auto cursor-pointer bg-black text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isOutOfStock}
          >
            Buy Now
          </button>
        </Link>
        <AuthContextProvider>
          <AddToCartButton
            type="cute"
            productId={product?.id}
            isOutOfStock={isOutOfStock}
          />
        </AuthContextProvider>
      </div>

      {/* Out of Stock Indicator */}
      {isOutOfStock && (
        <div className="flex justify-center sm:justify-start">
          <h3 className="bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm font-semibold inline-flex items-center gap-2">
            Out Of Stock
          </h3>
        </div>
      )}

      {/* Full Description */}
      <div className="border-t border-gray-200 pt-6 mt-4">
        <h4 className="font-bold text-xl text-gray-800 mb-3">
          Product Description
        </h4>
        <div
          className="text-gray-700 leading-relaxed prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}
        ></div>
      </div>
    </div>
  );
}

// --- RatingReview Component ---
async function RatingReview({ product }: any) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  const averageRating = counts?.averageRating ?? 0;
  const totalReviews = counts?.totalReviews ?? 0;

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < Math.round(averageRating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.927 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
      <span className="font-semibold text-gray-800">
        {averageRating.toFixed(1)}
      </span>
      <span className="text-gray-500">({totalReviews} Reviews)</span>
    </div>
  );
}
