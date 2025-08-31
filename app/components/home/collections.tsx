"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Collection = {
  id: string;
  title: string;
  subtitle: string;
  imageURL: string;
};

type CollectionGridProps = {
  collections: Collection[];
};

export default function CollectionGrid({ collections }: CollectionGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full px-4 sm:px-8 lg:px-12  flex justify-center"
    >
      <div className="grid gap-8 sm:grid-cols-2 max-w-5xl w-full place-items-center">
        {collections.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-xl 
                       bg-white/70 backdrop-blur-xl border border-white/20"
          >
            <Link
              href={`/collections/${item.id}`}
              className="block w-full h-[420px] sm:h-[500px] relative"
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
                <h2 className="text-white text-xl font-bold tracking-wide drop-shadow-lg">
                  {item.title}
                </h2>
                
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
