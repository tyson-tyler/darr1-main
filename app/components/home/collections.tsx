"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Collection = {
  id: string;
  title: string;
  subtitle: string;
  imageURL: string;
};

type CollectionSliderProps = {
  collections: Collection[];
};

export default function CollectionSlider({
  collections,
}: CollectionSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full px-4 sm:px-8 lg:px-12 py-16"
    >
      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 backdrop-blur transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 backdrop-blur transition"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative flex-shrink-0 w-[260px] sm:w-[300px] md:w-[340px] lg:w-[360px] 
                         rounded-3xl overflow-hidden shadow-xl bg-white/70 backdrop-blur-xl border border-white/20"
            >
              <Link
                href={`/collections/${item.id}`}
                className="block w-full h-[380px] sm:h-[580px] relative"
              >
                <Image
                  src={item.imageURL}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                                opacity-70 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-end p-6"
                >
                  <h2 className="text-white text-lg md:text-xl font-bold tracking-wide drop-shadow-lg">
                    {item.title}
                  </h2>
                  <p className="text-gray-200 text-sm md:text-base">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
