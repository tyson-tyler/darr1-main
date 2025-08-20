// components/ContactForm.tsx
"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import Footer from "@/app/components/footer/footer";

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

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-4 contact-bg relative">
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Form container */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="relative bg-slate-900/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-lg max-w-3xl w-full text-white"
        >
          <h2 className="text-3xl font-bold mb-2 text-center">Contact Us</h2>
          <p className="text-center mb-6 text-gray-300 text-sm">
            We use an agile approach to test assumptions and connect with the
            needs of your audience early and often.
          </p>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          </div>

          {/* Message */}
          <textarea
            name="message"
            rows={4}
            placeholder="Leave a comment..."
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          ></textarea>

          {/* Terms */}
          <p className="text-xs text-gray-400 mb-4">
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

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg w-full text-sm font-medium"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="text-green-400 text-center mt-4 text-sm">
              ✅ Message sent successfully!
            </p>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
}
