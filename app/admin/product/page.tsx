import Link from "next/link";
import React from "react";
import ListView from "./components/listview";

const page = () => {
  return (
    <main className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl">Products</h1>
        <Link href={"/admin/product/form"}>
          <button className="px-6  bg-purple-500 text-white hover:bg-purple-600 cursor-pointer py-2 rounded-md">
            Create
          </button>
        </Link>
      </div>
      <ListView />
    </main>
  );
};

export default page;
