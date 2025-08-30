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
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    user_email: "",
    phone: "",
    message: "",
  });

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_v69k3fw",
        "template_8hd7y69",
        form.current!,
        "IUi1A9UICuYBvtJdd"
      )
      .then(() => {
        setSuccess(true);
        setLoading(false);
        setFormData({
          first_name: "",
          last_name: "",
          user_email: "",
          phone: "",
          message: "",
        });
        form.current?.reset();
      })
      .catch((error) => {
        console.error(error.text);
        setLoading(false);
      });
  };

  // WhatsApp link
  const whatsappMessage = `Hello, my name is ${formData.first_name} ${formData.last_name}. 
Email: ${formData.user_email} 
Phone: ${formData.phone} 
Message: ${formData.message}`;
  const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 contact-bg relative">
        <div className="absolute inset-0 bg-black/50"></div>

        <motion.div
          className="relative bg-slate-900/90 backdrop-blur-md p-4 sm:p-6 md:p-10 rounded-2xl shadow-2xl max-w-3xl w-full text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.form
            ref={form}
            onSubmit={sendEmail}
            className="text-white space-y-3 sm:space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-center">
              Contact Us
            </h2>
            <p className="text-center mb-4 sm:mb-6 text-gray-300 text-xs sm:text-sm">
              We use an agile approach to test assumptions and connect with the
              needs of your audience early and often.
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                required
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="p-2.5 sm:p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                required
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="p-2.5 sm:p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="email"
                name="user_email"
                placeholder="Your email"
                required
                value={formData.user_email}
                onChange={(e) =>
                  setFormData({ ...formData, user_email: e.target.value })
                }
                className="p-2.5 sm:p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="p-2.5 sm:p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              name="message"
              rows={3}
              placeholder="Leave a comment..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full p-2.5 sm:p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            {/* Terms */}
            <p className="text-[11px] sm:text-xs text-gray-400">
              By submitting this form you agree to our{" "}
              <Link href="#" className="underline text-blue-400">
                terms and conditions
              </Link>{" "}
              and our{" "}
              <Link href="#" className="underline text-blue-400">
                privacy policy
              </Link>
              .
            </p>

            {/* Submit + WhatsApp side by side */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg w-full text-sm font-medium"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-colors text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg w-full text-sm font-medium"
              >
                <FaWhatsapp className="text-lg sm:text-xl" />
                WhatsApp
              </a>
            </div>

            {success && (
              <p className="text-green-400 text-center mt-3 sm:mt-4 text-xs sm:text-sm">
                ✅ Message sent successfully!
              </p>
            )}
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
