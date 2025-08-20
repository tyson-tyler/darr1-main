"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";

export default function Photos({ imageList }: { imageList: string[] }) {
  const [selectedImage, setSelectedImage] = useState(imageList?.[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  if (!imageList || imageList.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-gray-500">
        No images available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {/* Main Image with Zoom */}
      <div
        className="relative w-full aspect-square max-w-3xl rounded-3xl overflow-hidden bg-gradient-to-tr from-gray-50 to-white group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={(e) => {
          const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - left) / width) * 100;
          const y = ((e.clientY - top) / height) * 100;
          setPosition({ x, y });
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={selectedImage}
              alt="Selected product image"
              fill
              className={clsx(
                "object-cover w-full h-full transition-transform duration-300 ease-out",
                isZoomed && "scale-150"
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${position.x}% ${position.y}%`,
                    }
                  : {}
              }
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto gap-4 py-3 px-2 w-full justify-center scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {imageList.map((item, index) => {
          const isActive = item === selectedImage;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(item)}
              className={clsx(
                "relative flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300",
                "w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28",
                isActive
                  ? "border-indigo-500 shadow-lg ring-2 ring-indigo-400/40"
                  : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
              )}
            >
              <Image
                src={item}
                alt={`Thumbnail ${index + 1}`}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
