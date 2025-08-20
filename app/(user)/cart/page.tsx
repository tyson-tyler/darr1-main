"use client";

import { useAuth } from "@/context/authcontext";
import { useProduct } from "@/lib/firebase/products/read";
import { useUser } from "@/lib/firebase/user/read";
import { updateCarts } from "@/lib/firebase/user/write";
import { Loader2, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { user }: any = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });

  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {(!data?.carts || data?.carts?.length === 0) && (
        <div className="flex flex-col gap-6 items-center mt-20">
          <Image
            src="/empty.svg"
            width={200}
            height={200}
            alt="Empty"
            className="opacity-80"
          />
          <h2 className="text-gray-600 text-lg font-medium text-center">
            Your cart is empty.
          </h2>
          <Link href="/">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      )}

      {data?.carts?.length > 0 && (
        <>
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {data?.carts?.map((item: any) => (
              <ProductItem item={item} key={item?.id} />
            ))}
          </div>

          <div className="mt-10">
            <Link href={`/checkout?type=cart`}>
              <button className="bg-green-600 px-6 py-3 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

function ProductItem({ item }: any) {
  const { user }: any = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: product } = useProduct({ productId: item?.id });

  const handleRemove = async () => {
    if (!confirm("Remove this product from cart?")) return;
    setIsRemoving(true);
    try {
      const newList = data?.carts?.filter((d: any) => d?.id !== item?.id);
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error: any) {
      toast.error(error?.message);
    }
    setIsRemoving(false);
  };

  const handleUpdate = async (quantity: number) => {
    setIsUpdating(true);
    try {
      const newList = data?.carts?.map((d: any) =>
        d?.id === item?.id ? { ...d, quantity } : d
      );
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error: any) {
      toast.error(error?.message);
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex gap-4 items-center border border-gray-200 shadow-sm rounded-xl p-4 bg-white transition hover:shadow-md">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={product?.featureImageURL}
          alt="Product"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <h2 className="text-sm font-semibold text-gray-800">
          {product?.title}
        </h2>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <p className="text-sm text-green-600 font-medium">
              ₹ {product?.saleprice?.toFixed(2)}
              {product?.price && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ₹ {product?.price?.toFixed(2)}
                </span>
              )}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => handleUpdate(item?.quantity - 1)}
                disabled={isUpdating || item?.quantity <= 1}
                className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm">{item?.quantity}</span>
              <button
                onClick={() => handleUpdate(item?.quantity + 1)}
                disabled={isUpdating}
                className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-500 cursor-pointer hover:text-red-700 transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
