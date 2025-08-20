"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const router = useRouter();

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  const handleSubmit = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${query}`);
    router.refresh();
  };

  return (
    <div className="mx-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex mx-auto py-3 w-full max-w-5xl  justify-center items-center  rounded-full bg-white border border-gray-300 shadow-md focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, styles or drops..."
          type="text"
          className="w-full px-5 ml-2  text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-16 h-10 flex items-center cursor-pointer mr-4 justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
          aria-label="Search"
          title="Search"
        >
          <Search size={16} />
        </button>
      </form>
    </div>
  );
}
