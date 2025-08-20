"use client";
import { useCategories } from "@/lib/firebase/catergories/read"; // fix spelling if needed

import { deleteCategory } from "@/lib/firebase/catergories/write";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiLoader, BiPencil, BiTrash } from "react-icons/bi";

const ListView = () => {
  const { data: categories, error, isLoading } = useCategories();
  const [isDeleting, setIsDeleting] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <BiLoader className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure")) return;
    setIsDeleting(true);
    try {
      await deleteCategory({ id });

      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };
  const handelUpdate = (id) => {
    router.push(`/admin/catergories?id=${id}`);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-6 w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 gap-3">
        {id ? "Update" : "Create"} Categories
      </h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th className="py-3 px-4 border-b">SN</th>
            <th className="py-3 px-4 border-b">Image</th>
            <th className="py-3 px-4 border-b">Name</th>
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((item: any, index: number) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors text-sm"
            >
              <td className="py-3 px-4 border-b">{index + 1}</td>
              <td className="py-3 px-4 border-b">
                <div className="w-12 h-12 relative">
                  <Image
                    src={item?.image}
                    alt={item?.name || "Category Image"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              </td>
              <td className="py-3 px-4 border-b">{item?.name}</td>
              <td className="py-3 px-4 border-b">
                {/* Add edit/delete buttons here */}
                <button
                  onClick={() => handelUpdate(item.id)}
                  disabled={isDeleting}
                  className="text-blue-600 hover:bg-blue-500 hover:text-white mr-2 px-3 py-2 rounded-2xl"
                >
                  <BiPencil className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:bg-red-500 hover:text-white px-3 py-2 rounded-2xl"
                  disabled={isLoading}
                >
                  <BiTrash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
