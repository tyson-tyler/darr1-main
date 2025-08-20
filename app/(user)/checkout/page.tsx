"use client";
import { useAuth } from "@/context/authcontext";
import { useProductsByIds } from "@/lib/firebase/products/read";
import { useUser } from "@/lib/firebase/user/read";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import Checkout from "./components/checkOut";

const page = () => {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  const productIdsList =
    type === "buynow" ? [productId] : data?.carts?.map((item: any) => item?.id);
  console.log(productIdsList);

  const {
    data: products,
    error,
    isLoading,
  } = useProductsByIds({
    idsList: productIdsList,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

  if (!productIdsList || productIdsList?.length === 0) {
    return (
      <div>
        <h1>Product is Not found</h1>
      </div>
    );
  }

  const productList =
    type === "buynow"
      ? [
          {
            id: productId,
            quantity: 1,
            product: products[0],
          },
        ]
      : data?.carts?.map((item: any) => {
          return {
            ...item,
            product: products?.find((e: any) => e?.id === item?.id),
          };
        });

  return (
    <div>
      <Checkout productList={productList} />
    </div>
  );
};

export default page;
