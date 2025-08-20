"use client";

import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function InstagramBanner() {
  return (
    <section className="relative w-full h-[350px] md:h-[400px] overflow-hidden rounded-2xl mt-16 shadow-xl">
      {/* Background image */}
      <Image
        src="https://images.hdqwalls.com/wallpapers/girl-evening-sun-rays-on-face-06.jpg" // replace with your image path
        alt="Follow us on Instagram"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }}
        viewport={{ once: true }}
        className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center px-6"
      >
        <div className="text-center text-white max-w-2xl">
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaInstagram className="text-pink-500 text-4xl md:text-5xl" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Follow us on Instagram
            </h2>
          </motion.div>

          <motion.p
            className="text-sm md:text-base mb-6 text-white/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Stay connected for the latest drops, behind-the-scenes, and
            exclusive offers. 📸
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              href="https://instagram.com/yourhandle" // Replace with your IG handle
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-pink-600 hover:bg-pink-100 transition-all px-6 py-3 rounded-full font-semibold text-sm shadow-md"
            >
              Follow @thedrott
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
