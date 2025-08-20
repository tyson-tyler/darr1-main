"use client";
import React, { useEffect, useState } from "react";
import { BasicClient } from "../components/basicdetails";
import ImageProp from "../components/Image";
import Description from "../components/description";
import toast from "react-hot-toast";
import { createNewProduct } from "@/lib/firebase/products/write";
import { BiLoader } from "react-icons/bi";

import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/firebase/products/read_server";

// Define a type for your data state
type DataType = {
  [key: string]: any;
};

const Page = () => {
  const [data, setData] = useState<DataType>({});
  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [imageList, setImageList] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getProduct({ id: id });
      if (!res) {
        throw new Error("Product Not found");
      } else {
        setData(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  const handleData = (key: string, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createNewProduct({
        data: data,
        featureImage: featureImage,
        imageList: imageList,
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      toast.success("Product is Created");
      router.push("/admin/product");
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="p-5">
        <div className="flex w-full mb-2 items-center  justify-between px-2">
          <h1 className="font-semibold mb-4 text-2xl">
            {id ? "Update Product" : "Create New Product"}
          </h1>
          <button
            disabled={loading}
            type="submit"
            className="px-6  bg-purple-500 text-white hover:bg-purple-600 cursor-pointer py-2 rounded-md"
          >
            {loading ? (
              <span>
                <BiLoader className="w-4 animate-spin h-4 mr-2 inline-block" />
              </span>
            ) : id ? (
              "Update"
            ) : (
              "Create"
            )}
          </button>
        </div>
        <div className="flex md:flex-row flex-col gap-5">
          <div className="flex-1 flex flex-col gap-5">
            <BasicClient data={data} handleData={handleData} />
            <Description data={data} handleData={handleData} />
          </div>
          <div className="flex-1 flex flex-col gap-5">
            <ImageProp
              data={data}
              featureImage={featureImage}
              setFeatureImage={setFeatureImage}
              imageList={imageList}
              setImageList={setImageList}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
