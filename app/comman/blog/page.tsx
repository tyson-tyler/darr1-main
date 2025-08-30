"use client";

import { useState } from "react";
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
    img: "https://wallpaperaccess.com/full/6702489.png",
  },
  {
    id: 2,
    title: "Why T-Shirts Never Go Out of Style",
    desc: "T-shirts have remained timeless because of their comfort, simplicity, and adaptability. From casual wear to layering with jackets or even semi-formal outfits, t-shirts fit every mood and occasion. They are affordable, expressive, and suitable for all genders, making them a true fashion essential.",
    img: "https://tse1.explicit.bing.net/th/id/OIP.JrWycbbogYKbN3KacsyqcQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 3,
    title: "Gen Z Fashion: T-Shirt Edition",
    desc: "Gen Z is redefining t-shirt fashion by embracing oversized fits, bold graphics, sustainable fabrics, and streetwear-inspired designs. Trendy crop tops, tie-dye patterns, and minimalistic logos are ruling social media. For Gen Z, t-shirts are not just clothes—they’re a way of expressing identity and culture.",
    img: "https://wallpaperaccess.com/full/4080746.jpg",
  },
];

export default function BlogSection() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      <motion.h2
        className="text-4xl font-extrabold text-center mb-14 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Blog
      </motion.h2>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={() => setSelectedBlog(blog)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            {/* Bigger & Responsive Image */}
            <motion.img
              src={blog.img}
              alt={blog.title}
              className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-4">
              <h3 className="text-lg font-semibold text-white">{blog.title}</h3>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">{blog.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Taller modal image */}
              <motion.img
                src={selectedBlog.img}
                alt={selectedBlog.title}
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded-2xl mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedBlog.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {selectedBlog.desc}
              </p>

              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
