"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCloud } from "react-icons/fa6";

interface ImagePropTypes {
  imageList: File[];
  setImageList: (files: File[]) => void;
  setFeatureImage: (file: File) => void;
  featureImage: File | null;
}

const ImageProp: React.FC<ImagePropTypes> = ({
  data,
  imageList,
  setImageList,
  setFeatureImage,
  featureImage,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const previews = imageList.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageList]);

  const handleRemoveImage = (index: number) => {
    const updatedList = [...imageList];
    updatedList.splice(index, 1);
    setImageList(updatedList);
  };
  console.log(data?.imageList);
  return (
    <section className="flex flex-col gap-4 flex-1 border p-4 rounded-xl">
      <h1 className="text-2xl font-semibold">Images</h1>

      {/* Feature Image */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="product-feature-image"
          className="text-xs text-gray-500"
        >
          Feature Image
        </label>

        <label
          htmlFor="product-feature-image"
          className="relative w-full aspect-[9/3] border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-blue-400 transition"
        >
          {data?.featureImageURL && !featureImage && (
            <Image
              src={data?.featureImageURL}
              alt="Feature Image"
              fill
              className="object-contain rounded-md"
            />
          )}
          {featureImage ? (
            <Image
              src={URL.createObjectURL(featureImage)}
              alt="Feature Image"
              fill
              className="object-contain rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <FaCloud className="text-3xl mb-1" />
              <span className="text-sm">Upload Feature Image</span>
            </div>
          )}
          <input
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFeatureImage(e.target.files[0]);
              }
            }}
            type="file"
            id="product-feature-image"
            name="product-feature-image"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
          />
        </label>
      </div>

      {/* Additional Images */}
      <div className="flex flex-col gap-2">
        <label htmlFor="product-images" className="text-xs text-gray-500">
          Additional Images
        </label>

        <label
          htmlFor="product-images"
          className="relative w-full aspect-[8/3] border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-blue-400 transition"
        >
          <div className="flex flex-col items-center text-gray-400">
            <FaCloud className="text-3xl mb-1" />
            <span className="text-sm">Upload Additional Images</span>
          </div>
          <input
            onChange={(e) => {
              if (e.target.files?.length) {
                const filesArray = Array.from(e.target.files);
                setImageList([...imageList, ...filesArray]);
              }
            }}
            type="file"
            multiple
            id="product-images"
            name="product-images"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            required
          />
        </label>

        {data?.imageList?.length != 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {data?.imageList?.map((items, index) => (
              <div key={items} className="relative group w-20 h-20">
                <Image
                  src={items}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative group w-20 h-20">
                <Image
                  src={src}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-[-6px] right-[-6px] bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow"
                  aria-label="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageProp;
