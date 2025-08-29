// components/ContactForm.tsx
"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import Footer from "@/app/components/footer/footer";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactForm() {
  const form = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_v69k3fw", // replace with your service ID
        "template_8hd7y69", // replace with your template ID
        form.current!,
        "IUi1A9UICuYBvtJdd" // replace with your public key
      )
      .then(() => {
        setSuccess(true);
        setLoading(false);
        form.current?.reset();
      })
      .catch((error) => {
        console.error(error.text);
        setLoading(false);
      });
  };

  // Framer Motion Variants
  const containerVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-4 contact-bg relative">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Motion container */}
        <motion.div
          className="relative bg-slate-900/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-2xl max-w-3xl w-full text-white"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          {/* WhatsApp Button */}
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="https://wa.me/919876543210" // replace with your WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              <FaWhatsapp className="text-2xl" />
              <span className="font-semibold">Chat on WhatsApp</span>
            </a>
          </motion.div>

          {/* Form */}
          <motion.form
            ref={form}
            onSubmit={sendEmail}
            className="text-white space-y-4"
          >
            <motion.h2
              className="text-3xl font-bold mb-2 text-center"
              variants={itemVariant}
              custom={0}
              initial="hidden"
              animate="visible"
            >
              Contact Us
            </motion.h2>
            <motion.p
              className="text-center mb-6 text-gray-300 text-sm"
              variants={itemVariant}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              We use an agile approach to test assumptions and connect with the
              needs of your audience early and often.
            </motion.p>

            {/* Name */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={itemVariant}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                required
                className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                required
                className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Email + Phone */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={itemVariant}
              custom={3}
              initial="hidden"
              animate="visible"
            >
              <input
                type="email"
                name="user_email"
                placeholder="Your email"
                required
                className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Message */}
            <motion.textarea
              name="message"
              rows={4}
              placeholder="Leave a comment..."
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              variants={itemVariant}
              custom={4}
              initial="hidden"
              animate="visible"
            ></motion.textarea>

            {/* Terms */}
            <motion.p
              className="text-xs text-gray-400"
              variants={itemVariant}
              custom={5}
              initial="hidden"
              animate="visible"
            >
              By submitting this form you agree to our{" "}
              <Link href="#" className="underline text-blue-400">
                terms and conditions
              </Link>{" "}
              and our{" "}
              <Link href="#" className="underline text-blue-400">
                privacy policy
              </Link>
              .
            </motion.p>

            {/* Submit */}
            <motion.button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg w-full text-sm font-medium"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariant}
              custom={6}
              initial="hidden"
              animate="visible"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>

            {success && (
              <motion.p
                className="text-green-400 text-center mt-4 text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✅ Message sent successfully!
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
