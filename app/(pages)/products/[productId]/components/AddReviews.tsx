"use client";

import { useAuth } from "@/context/authcontext";
import { addReview } from "@/lib/firebase/reviews/write";
import { useUser } from "@/lib/firebase/user/read";
import { Rating } from "@mui/material";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AddReview({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a review message.");
      return;
    }

    setIsLoading(true);
    try {
      await addReview({
        displayName: userData?.email,
        message,
        photoURL: userData?.photoURL,
        productId,
        rating,
        uid: user.uid,
      });
      setMessage("");
      toast.success("Review submitted!");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[100rem] mx-auto flex flex-col gap-4 p-5 bg-white shadow-xl border border-gray-200 rounded-2xl"
    >
      <h2 className="text-xl font-semibold text-gray-800">Rate This Product</h2>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Your Rating:</span>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue || 0)}
          size="medium"
        />
      </div>

      {/* Message Input */}
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder=" Share your thoughts about the product... "
          rows={4}
          className="peer w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={isLoading}
        whileTap={{ scale: 0.96 }}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-all"
      >
        {isLoading ? "Submitting..." : "Submit Review"}
      </motion.button>
    </motion.div>
  );
}
