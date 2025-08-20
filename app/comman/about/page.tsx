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
            src="/3.jpg" // replace with your image
            alt="About Hero"
            fill
            className="object-cover opacity-60"
          />
          <h1 className="relative text-white text-4xl md:text-6xl font-bold z-10">
            About
          </h1>
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
              src="/1 (2).jpeg" // replace with your image
              alt="About us"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </section>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative w-full h-[350px] md:h-[450px]">
          <Image
            src="/2.webp" // replace with your image
            alt="Our Mission"
            fill
            className="object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Mauris non lacinia magna. Sed nec lobortis dolor. Vestibulum rhoncus
            dignissim risus, sed consectetur erat. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas.
            Nullam maximus mauris sit amet odio convallis, in pharetra magna
            gravida.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Praesent sed nunc fermentum mi molestie tempor. Morbi vitae viverra
            odio. Pellentesque ac velit egestas, luctus arcu non, laoreet
            mauris. Pellentesque tempor urna vitae mi vestibulum, nec venenatis
            nulla lobortis.
          </p>

          {/* Quote */}
          <blockquote className="mt-8 pl-4 border-l-4 border-gray-300 italic text-gray-700">
            "Creativity is just connecting things. When you ask creative people
            how they did something, they feel a little guilty because they
            didn’t really do it, they just saw something. It seemed obvious to
            them after a while."
            <footer className="mt-3 not-italic text-gray-500 font-medium">
              – Steve Jobs
            </footer>
          </blockquote>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutPage;
