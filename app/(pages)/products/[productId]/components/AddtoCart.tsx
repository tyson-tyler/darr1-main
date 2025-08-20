"use client";

import { useAuth } from "@/context/authcontext";
import { useUser } from "@/lib/firebase/user/read";
import { updateCarts } from "@/lib/firebase/user/write";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { FaCartPlus } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { ShoppingBagIcon, ShoppingCart } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function AddToCartButton({
  productId,
  type,
  isOutOfStock,
}: any) {
  const { user }: any = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isAdded = data?.carts?.find((item: any) => item?.id === productId);

  const handlClick = async () => {
    if (isLoading || isOutOfStock) return;
    setIsLoading(true);
    try {
      if (!user?.uid) {
        router.push("/auth/login");
        throw new Error("Please log in first!");
      }

      const newList = isAdded
        ? data?.carts?.filter((item: any) => item?.id !== productId)
        : [...(data?.carts ?? []), { id: productId, quantity: 1 }];

      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error: any) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  // Variant 1: Cute button
  if (type === "cute") {
    return (
      <button
        onClick={handlClick}
        disabled={isLoading || isOutOfStock}
        className={` cursor-pointer px-6 py-3 rounded-xl font-medium border text-sm shadow-sm transition-all
          ${
            isAdded
              ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
              : "border-black text-black font-semibold  hover:text-white hover:bg-black"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isLoading
          ? "Processing..."
          : isAdded
          ? "Remove from Cart"
          : "Add to Cart"}
      </button>
    );
  }

  // Variant 2: Large icon button
  if (type === "large") {
    return (
      <button
        onClick={handlClick}
        disabled={isLoading || isOutOfStock}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold shadow-sm border transition
          ${
            isAdded
              ? "bg-white text-red-600 border-red-300 hover:bg-red-100"
              : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isLoading ? (
          <span className="animate-pulse">Loading...</span>
        ) : (
          <>
            {isAdded ? (
              <FaShoppingBag className="text-lg" />
            ) : (
              <FaCartPlus className="text-lg" />
            )}
            {isAdded ? "Remove from Cart" : "Add to Cart"}
          </>
        )}
      </button>
    );
  }

  // Variant 3: Animated icon-only
  return (
    <button
      onClick={handlClick}
      disabled={isLoading || isOutOfStock}
      className={`w-full h-[50px] px-5 flex justify-center items-center gap-2 rounded-full border text-sm font-medium
        transition-all shadow-sm border-black hover:bg-black hover:text-white
        ${isAdded ? "bg-black text-white" : "bg-white text-black"}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="animate-pulse">Loading...</span>
          </motion.div>
        ) : isAdded ? (
          <motion.div
            key="added"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Added</span>
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
