"use client";

import { useCategories } from "@/lib/firebase/catergories/read";

export const BasicClient = ({ data, handleData }: any) => {
  const { data: catergory } = useCategories();
  return (
    <section className="flex flex-1 flex-col  gap-5">
      <div className="flex flex-col w-full  gap-2">
        <label htmlFor="product-name" className="text-xs text-gray-500">
          Product Name
        </label>
        <input
          value={data?.title ?? ""}
          onChange={(e) => handleData("title", e.target.value)}
          type="text"
          placeholder="Enter title"
          id="product-title"
          name="product-title"
          className="border px-4 py-2  rounded-md outline-none"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="short-description" className="text-xs text-gray-500">
          Short Description
        </label>
        <input
          value={data?.shortDescription ?? ""}
          onChange={(e) => handleData("shortDescription", e.target.value)}
          type="text"
          placeholder="Enter Short Description"
          id="short-description"
          name="short-description"
          className="border px-4 py-2  rounded-md outline-none"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="product-catergory" className="text-xs text-gray-500">
          Catergory
        </label>
        <select
          value={data?.catergoryId ?? ""}
          onChange={(e) => handleData("catergoryId", e.target.value)}
          id="product-catergory"
          name="product-catergory"
          className="border px-4 py-2 pr-2  rounded-md outline-none"
          required
        >
          <option value="">Select Catergory </option>
          {catergory?.map((item: any) => {
            return (
              <option value={item?.id} key={item?.id}>
                {item?.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="product-stock" className="text-xs text-gray-500">
          Stock
        </label>
        <input
          value={data?.stock ?? ""}
          onChange={(e) => handleData("stock", e.target.valueAsNumber)}
          type="number"
          placeholder="Enter Stock"
          id="product-stock"
          name="product-stock"
          className="border px-4 py-2  rounded-md outline-none"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="product-price" className="text-xs text-gray-500">
          Price
        </label>
        <input
          value={data?.price ?? ""}
          onChange={(e) => handleData("price", e.target.valueAsNumber)}
          type="number"
          placeholder="Enter price"
          id="product-price"
          name="product-price"
          className="border px-4 py-2  rounded-md outline-none"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="product-saleprice" className="text-xs text-gray-500">
          Sale Price
        </label>
        <input
          value={data?.saleprice ?? ""}
          onChange={(e) => handleData("saleprice", e.target.valueAsNumber)}
          type="number"
          placeholder="Enter Sale price"
          id="product-saleprice"
          name="product-saleprice"
          className="border px-4 py-2  rounded-md outline-none"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-is-featured-product"
        >
          Is Featured Product{" "}
        </label>
        <select
          id="product-is-featured-product"
          name="product-is-featured-product"
          value={data?.isFeatured ? "yes" : "no"}
          onChange={(e) => {
            handleData("isFeatured", e.target.value === "yes" ? true : false);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value={"no"}>No</option>
          <option value={"yes"}>Yes</option>
        </select>
      </div>
    </section>
  );
};
