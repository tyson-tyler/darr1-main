"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Blog = {
  id: number;
  title: string;
  desc: string;
  img: string;
};

const blogs: Blog[] = [
  {
    id: 1,
    title: "T-Shirt Styling Tips for Boys & Girls",
    desc: "T-shirts are the most versatile clothing piece in every wardrobe. Boys can style plain tees with denim jackets, cargo pants, or sneakers for a casual look, while girls can pair oversized tees with skirts, biker shorts, or layer with blazers. Accessorizing with caps, chains, or belts instantly upgrades your outfit.",
    img: "https://source.unsplash.com/600x400/?tshirt,fashion",
  },
  {
    id: 2,
    title: "Why T-Shirts Never Go Out of Style",
    desc: "T-shirts have remained timeless because of their comfort, simplicity, and adaptability. From casual wear to layering with jackets or even semi-formal outfits, t-shirts fit every mood and occasion. They are affordable, expressive, and suitable for all genders, making them a true fashion essential.",
    img: "https://source.unsplash.com/600x400/?tshirt,style",
  },
  {
    id: 3,
    title: "Gen Z Fashion: T-Shirt Edition",
    desc: "Gen Z is redefining t-shirt fashion by embracing oversized fits, bold graphics, sustainable fabrics, and streetwear-inspired designs. Trendy crop tops, tie-dye patterns, and minimalistic logos are ruling social media. For Gen Z, t-shirts are not just clothes—they’re a way of expressing identity and culture.",
    img: "https://source.unsplash.com/600x400/?genz,clothing",
  },
];


export default function BlogSection() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Our Blog</h2>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedBlog(blog)}
          >
            <Image
              src={blog.img}
              alt={blog.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{blog.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
              <Image
                src={selectedBlog.img}
                alt={selectedBlog.title}
                width={800}
                height={500}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <h3 className="text-2xl font-bold mb-3">{selectedBlog.title}</h3>
              <p className="text-gray-700 text-base">{selectedBlog.desc}</p>

              {/* Close button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
