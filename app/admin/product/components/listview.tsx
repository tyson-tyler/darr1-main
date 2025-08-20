"use client";

import { useProducts } from "@/lib/firebase/products/read";
import { deleteProduct } from "@/lib/firebase/products/write";
import { CheckCircle, Edit2, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const {
    data: products,
    error,
    isLoading,
    lastSnapDoc,
  } = useProducts({
    pageLimit: pageLimit,
    lastSnapDoc:
      lastSnapDocList.length === 0
        ? null
        : lastSnapDocList[lastSnapDocList.length - 1],
  });

  const handleNextPage = () => {
    setLastSnapDocList((prev) => [...prev, lastSnapDoc]);
  };

  const handlePrevPage = () => {
    setLastSnapDocList((prev) => prev.slice(0, -1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">SN</th>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Orders</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((item, index) => (
            <ProductRow
              key={item.id}
              item={item}
              index={index + lastSnapDocList.length * pageLimit}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={lastSnapDocList.length === 0}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={handleNextPage}
            disabled={!lastSnapDoc}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[3, 5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num} Items/Page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ProductRow({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setIsDeleting(true);
      await deleteProduct({ id: item.id });
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3">{index + 1}</td>
      <td className="px-4 py-3">
        <Image
          width={50}
          height={50}
          src={item.featureImageURL}
          alt={item.title}
          className="h-10 w-10 object-cover rounded-md"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap flex gap-3 items-center ">
        {item.title}{" "}
        {item?.isFeatured === true && (
          <CheckCircle className="w-4 h-4 text-green-500" />
        )}
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-800 font-medium">₹{item.price}</div>
        {item.saleprice && (
          <div className="text-xs text-gray-400 line-through">
            ₹{item.saleprice}
          </div>
        )}
      </td>
      <td className="px-4 py-3">{item.stock}</td>
      <td className="px-4 py-3">{item.orders ?? 0}</td>
      <td className="px-4 py-3">
        {item.stock - (item.orders ?? 0) > 0 ? (
          <span className="text-green-600 bg-green-100 px-2 py-1 text-xs rounded">
            Available
          </span>
        ) : (
          <span className="text-red-600 bg-red-100 px-2 py-1 text-xs rounded">
            Out of Stock
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => router.push(`/admin/product/form?id=${item.id}`)}
            title="Edit"
            className="p-2 cursor-pointer rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-300 shadow-sm hover:shadow-md"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            title="Delete"
            disabled={isDeleting}
            className="p-2 rounded-md cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 border border-transparent hover:border-red-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
