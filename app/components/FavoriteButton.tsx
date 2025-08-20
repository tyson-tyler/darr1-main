"use client";

import { useAuth } from "@/context/authcontext";
import { useUser } from "@/lib/firebase/user/read";
import { updateFavorites } from "@/lib/firebase/user/write";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";

export default function FavoriteButton({ productId }: { productId: string }) {
  const { user }: any = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        router.push("/auth/login");
        throw new Error("Please log in first!");
      }

      const currentFavorites = data?.favorites ?? [];

      const updatedList = currentFavorites.includes(productId)
        ? currentFavorites.filter((item: any) => item !== productId)
        : [...currentFavorites, productId];

      await updateFavorites({ list: updatedList, uid: user?.uid });
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  const isLiked = data?.favorites?.includes(productId);

  return (
    <motion.button
      disabled={isLoading}
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
      className="text-2xl transition-all duration-300 ease-in-out"
    >
      {isLiked ? (
        <motion.div
          key="liked"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <IoHeart className="text-pink-500 drop-shadow-sm cursor-pointer" />
        </motion.div>
      ) : (
        <motion.div
          key="not-liked"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <IoHeartOutline className="text-gray-500 cursor-pointer" />
        </motion.div>
      )}
    </motion.button>
  );
}
