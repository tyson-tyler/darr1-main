"use client";
import { getAdmin } from "@/lib/firebase/admin/read_server";
import { createNewAdmin, UpdateAdmin } from "@/lib/firebase/admin/write";
import { getCatergory } from "@/lib/firebase/catergories/read_server";
import {
  createNewCategory,
  UpdateCategory,
} from "@/lib/firebase/catergories/write";
import { updateCurrentUser } from "firebase/auth";
import { Span } from "next/dist/trace";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";

interface CategoryData {
  name?: string;

  email?: string;
}

const Form: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [data, setData] = useState<CategoryData>({});
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
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

  const fetchdata = async () => {
    try {
      const res = await getAdmin({ id: id });
      console.log(res);
      if (res) {
        setData(res);
      } else {
        toast.error("Admin not found");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };
  useEffect(() => {
    if (id) {
      fetchdata();
    }
  }, [id]);
  const handleData = (key: keyof CategoryData, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    console.log({ data, image });
  };
  const handelCreate = async () => {
    try {
      await createNewAdmin({ data: data, image: image });
      toast.success("Create Successfully");
      setData({ name: "", email: "" });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);

    try {
      await handelCreate(); // wait for async task to complete
      console.log("Final submitted data:", { ...data, image });
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false); // only set loading to false after task is done
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await UpdateAdmin({ data: data, image: image });
      toast.success("successfully update");
      setData({ name: "", email: "" });
      setImage(null);
      setImagePreview(null);

      router.push("/admin/admins");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-8 w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">Create Admins</h1>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            handleUpdate();
          } else {
            handleSubmit();
          }
        }}
      >
        {/* Name Field */}
        <div>
          <label
            htmlFor="admin-name"
            className="block text-sm font-medium mb-1"
          >
            Name
          </label>
          <input
            value={data.name ?? ""}
            onChange={(e) => handleData("name", e.target.value)}
            id="admin-name"
            name="admin-name"
            type="text"
            placeholder="Enter Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-purple-400 focus:outline-none bg-white"
            required
          />
        </div>

        {/* Slug Field */}

        <div>
          <label
            htmlFor="admin-email"
            className="block text-sm font-medium mb-1"
          >
            Email
          </label>
          <input
            value={data.email ?? ""}
            onChange={(e) => handleData("email", e.target.value)}
            id="admin-email"
            name="admin-email"
            type="email"
            placeholder="Enter Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-purple-400 focus:outline-none bg-white"
            required
          />
        </div>

        {/* Image Upload with Preview */}
        <div>
          <label htmlFor="cat-admin" className="block text-sm font-medium mb-2">
            Image
          </label>
          <div className="relative h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:border-purple-600 transition-all duration-300 ease-in-out">
            <input
              id="cat-admin"
              name="cat-admin"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-[400px] opacity-0 cursor-pointer"
              required
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="object-contain rounded-md h-[400px] w-full transition-all duration-300"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-purple-700 cursor-pointer text-white font-semibold rounded-lg py-3 transition duration-300 ease-in-out flex items-center justify-center ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-800"
          }`}
        >
          {isLoading ? (
            <BiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <span>{id ? "Update" : "Create"}</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;
