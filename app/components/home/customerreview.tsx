"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

type Review = {
  name: string;
  message: string;
  rating: number;
};

export default function CustomerReviews() {
  const list: Review[] = [
    {
      name: "Penny Albritton",
      message:
        "Absolutely loved it! The quality exceeded my expectations. Will definitely shop here again.",
      rating: 4.5,
    },
    {
      name: "Oscar Nommanee",
      message:
        "Customer service was top-notch and the delivery was super fast. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emma Watson",
      message:
        "The product was exactly as described. Packaging was neat and safe. Very satisfied.",
      rating: 4.5,
    },
    {
      name: "Liam Carter",
      message:
        "I'm impressed by the attention to detail. This store really values its customers.",
      rating: 5,
    },
    {
      name: "Sophia Patel",
      message:
        "Such a smooth shopping experience. The website was easy to navigate and checkout was quick.",
      rating: 5,
    },
    {
      name: "Noah Kim",
      message:
        "Beautifully crafted and well-made. This was my second order and won’t be my last!",
      rating: 4.5,
    },
  ];

  return (
    <section className="flex justify-center py-16 px-6 sm:px-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full md:max-w-[1400px] flex flex-col gap-10">
        {/* Title */}
        <h1 className="text-center font-bold text-2xl sm:text-3xl lg:text-5xl text-gray-900 leading-snug">
          Our Customers <span className="text-yellow-500">Love Us</span> 💛
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {list.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4 items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Initials Badge */}
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 font-bold text-2xl shadow-md">
                {item.name.charAt(0)}
              </div>

              {/* Name */}
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(item.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : i < item.rating
                        ? "text-yellow-500 fill-yellow-500/50"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Message */}
              <p className="text-sm text-gray-600 leading-relaxed">
                “{item.message}”
              </p>
            </motion.div>
          ))}
        </div>

        {/* Button */}
      </div>
    </section>
  );
}
