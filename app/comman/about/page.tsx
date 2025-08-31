"use client";
import React from "react";
import Image from "next/image";
import Footer from "@/app/components/footer/footer";

const AboutPage = () => {
  return (
    <>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] flex items-center justify-center bg-gray-900">
          <Image
            src="https://res.cloudinary.com/dblf5n0yn/image/upload/v1756630975/poiz2vba5bxwuhj9qxnp.jpg" // replace with your image
            alt="About Hero"
            fill
            className="object-cover opacity-60"
          />
          
        </section>

        {/* Our Story Section */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At <span className="font-semibold">The Drott</span>, we believe
              fashion isn’t just about wearing clothes—it’s about expressing who
              you are. That’s why our brand stands for individuality,
              confidence, and creativity.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our tagline,{" "}
              <span className="italic">“Think Unique, Think You,”</span> is more
              than just words—it’s a reminder that you don’t need to fit in to
              stand out. Every piece in our collection reflects bold
              personalities and fresh perspectives.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The Drott is a community for those who aren’t afraid to be
              different, who create their own path. Made with care, quality, and
              a touch of attitude, our clothing helps you own your vibe every
              single day.
            </p>
          </div>

          {/* Image */}
          <div className="relative w-full h-[350px] md:h-[450px]">
            <Image
              src="https://res.cloudinary.com/dblf5n0yn/image/upload/v1756630688/eitokvminai4o2x6mhzs.png" // replace with your image
              alt="About us"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </section>
      </div>

    

      <Footer />
    </>
  );
};

export default AboutPage;
