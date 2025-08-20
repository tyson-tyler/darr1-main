"use client";

import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import { getProductReviewCounts } from "@/lib/firebase/products/count/read";

export function RatingReview({ product }: any) {
  const [counts, setCounts] = useState<{
    averageRating: number;
    totalReviews: number;
  }>({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    async function fetchCounts() {
      const result = await getProductReviewCounts({ productId: product?.id });
      setCounts({
        averageRating: result?.averageRating ?? 0,
        totalReviews: result?.totalReviews ?? 0,
      });
    }

    fetchCounts();
  }, [product?.id]);

  return (
    <div className="flex gap-3 items-center">
      <Rating
        name="product-rating"
        value={counts.averageRating}
        precision={0.5}
        readOnly
      />
      <h1 className="text-xs text-gray-400">
        <span>{counts.averageRating.toFixed(1)}</span> ({counts.totalReviews})
      </h1>
    </div>
  );
}
