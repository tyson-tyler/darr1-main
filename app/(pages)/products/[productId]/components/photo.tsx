"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Photos({ imageList }: { imageList: string[] }) {
  const [selectedImage, setSelectedImage] = useState(imageList?.[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!imageList || imageList.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-gray-500">
        No images available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {/* ✅ Grid for XL Screens (Soul Store style) */}
      <div className="hidden xl:grid grid-cols-2 grid-rows-2 gap-4 w-full max-w-6xl">
        {imageList.slice(0, 4).map((item, index) => (
          <motion.div
            key={index}
            className="relative w-full aspect-square overflow-hidden rounded-2xl bg-white shadow-sm cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setSelectedImage(item);
              setIsModalOpen(true);
            }}
          >
            <Image
              src={item}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* ✅ Main Image with Zoom - Only for LG Screens */}
      <div
        className="relative w-full aspect-square max-w-3xl rounded-3xl overflow-hidden bg-gradient-to-tr from-gray-50 to-white group hidden lg:block xl:hidden"
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
                  ? { transformOrigin: `${position.x}% ${position.y}%` }
                  : {}
              }
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ✅ Slider for Mobile & Medium Screens */}
      <div className="relative w-full max-w-3xl sm:block lg:hidden">
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="rounded-2xl overflow-hidden"
        >
          {imageList.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative aspect-square w-full">
                <Image
                  src={item}
                  alt={`Slider Image ${index + 1}`}
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 🔥 Modal for XL Screens */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-5xl w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={selectedImage}
                alt="Modal product image"
                fill
                className="object-contain bg-black"
              />
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
