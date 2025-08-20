"use client";

import { getCollection } from "@/lib/firebase/collections/read_server";
import {
  createNewCollection,
  updateCollection,
} from "@/lib/firebase/collections/write";
import { useProduct, useProducts } from "@/lib/firebase/products/read";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, ChangeEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { motion } from "framer-motion";

interface CollectionData {
  id?: string;
  title?: string;
  subtitle?: string;
  imageURL?: string;
  products?: string[];
}

const Form: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [data, setData] = useState<CollectionData>({});
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { data: products } = useProducts({ pageLimit: 2000 });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getCollection({ id });
      if (res) {
        setData(res);
        setImagePreview(res.imageURL || null);
      } else {
        toast.error("Collection not found");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch data");
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleData = (key: keyof CollectionData, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      await createNewCollection({ data, image });
      toast.success("Created successfully");
      setData({ title: "", subtitle: "", products: [] });
      setImage(null);
      setImagePreview(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await handleCreate();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateCollection({ data, image });
      toast.success("Updated successfully");
      setData({ title: "", subtitle: "", products: [] });
      setImage(null);
      setImagePreview(null);
      router.push("/admin/collections");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white text-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
        {id ? "Update Collection" : "Create Collection"}
      </h1>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          id ? handleUpdate() : handleSubmit();
        }}
      >
        {/* Title Field */}
        <div>
          <label
            htmlFor="collections-title"
            className="text-sm font-medium mb-1 block"
          >
            Title
          </label>
          <input
            value={data.title ?? ""}
            onChange={(e) => handleData("title", e.target.value)}
            id="collections-title"
            type="text"
            placeholder="Enter title"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-purple-400 outline-none transition-all"
          />
        </div>

        {/* Subtitle Field */}
        <div>
          <label
            htmlFor="collections-subtitle"
            className="text-sm font-medium mb-1 block"
          >
            Subtitle
          </label>
          <input
            value={data.subtitle ?? ""}
            onChange={(e) => handleData("subtitle", e.target.value)}
            id="collections-subtitle"
            type="text"
            placeholder="Enter subtitle"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-purple-400 outline-none transition-all"
          />
        </div>

        {/* Image Upload with Preview */}
        <div>
          <label
            htmlFor="collections-image"
            className="text-sm font-medium mb-2 block"
          >
            Image
          </label>
          <div className="relative h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:border-purple-600 transition-all duration-300">
            <input
              id="collections-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <motion.img
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                src={imagePreview}
                alt="Preview"
                className="object-contain rounded-md h-full w-full"
              />
            ) : (
              <>
                <svg
                  className="w-10 h-10 mb-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                <p>Click or drag to upload</p>
              </>
            )}
          </div>
        </div>

        {/* Product Tags */}
        <div className="flex flex-wrap gap-3">
          {data?.products?.map((productId) => (
            <ProductCard
              key={productId}
              productId={productId}
              setData={setData}
            />
          ))}
        </div>

        {/* Product Selector */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="collection-products"
            className="text-gray-700 text-sm"
          >
            Select Product <span className="text-red-500">*</span>
          </label>
          <select
            id="collection-products"
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return;
              setData((prevData) => ({
                ...prevData,
                products: [...(prevData.products || []), value],
              }));
            }}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select Product</option>
            {products?.map((item) => (
              <option
                key={item?.id}
                value={item?.id}
                disabled={data?.products?.includes(item?.id)}
              >
                {item?.title}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`bg-purple-700 text-white font-semibold rounded-lg py-3 flex items-center justify-center transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-800"
          }`}
        >
          {isLoading ? (
            <BiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <span>{id ? "Update" : "Create"}</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Form;

// ProductCard Subcomponent

interface ProductCardProps {
  productId: string;
  setData: React.Dispatch<React.SetStateAction<CollectionData>>;
}

function ProductCard({ productId, setData }: ProductCardProps) {
  const { data: product } = useProduct({ productId });

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex gap-2 items-center bg-blue-500 text-white px-4 py-1 rounded-full text-sm shadow-sm"
    >
      <h2>{product?.title}</h2>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setData((prevData) => {
            const filtered = (prevData.products || []).filter(
              (id) => id !== productId
            );
            return {
              ...prevData,
              products: filtered,
            };
          });
        }}
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}
