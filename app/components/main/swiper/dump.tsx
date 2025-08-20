"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import Mainnav from "../../navbar/mainnav";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"] });

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.7, 0, 0.1, 1.2");

const words = [
  "Durable",
  "High-Performance",
  "Precision",
  "Stylish",
  "Reliable",
];

const slideData = [
  {
    img: "/1.jpg",
    title: "Urban Style",
    description:
      "Elevate your streetwear game with urban-inspired comfort and flair.",
  },
  {
    img: "/3.jpg",
    title: "Cozy Fit",
    description:
      "Wrap yourself in warmth with our ultra-soft, cozy-fit t-shirts.",
  },
  {
    img: "/5.jpg",
    title: "Classic White",
    description:
      "Timeless, versatile, and always in style — the essential white tee.",
  },
  {
    img: "/6.jpg",
    title: "Bold & Bright",
    description: "Make a statement with vibrant colors and standout prints.",
  },
];

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);

  const animateSlideBad = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Ugly chaotic animation
      tl.set(imgRef.current, {
        clipPath: "inset(20% 40% 30% 50%)",
        rotate: -20,
        scale: 0.7,
        opacity: 0.5,
      }).to(imgRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        rotate: 15,
        scale: 1.3,
        opacity: 1,
        duration: 1.8,
        ease: "bounce.in",
      });
    });

    return () => ctx.revert();
  };

  useEffect(() => {
    animateSlideBad();
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-30">
        <Mainnav />
      </div>

      {/* Background Image */}
      <div
        ref={imgRef}
        className="absolute inset-0 w-full h-full z-0 transition-all"
      >
        <Image
          src={slideData[index].img}
          alt="carousel"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Static Text and CTA */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12">
        <h1
          className={`${bebas.className} text-5xl sm:text-6xl md:text-7xl drop-shadow-lg leading-tight`}
        >
          {words[index]} {slideData[index].title}
        </h1>
        <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mt-4 font-medium">
          {slideData[index].description}
        </p>
        <button className="mt-6 cursor-pointer px-8 py-3 sm:px-10 sm:py-4 rounded-full border border-white text-white text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md bg-white/10">
          Shop Now
        </button>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-24 sm:bottom-20 right-1/2 translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={() =>
            setIndex((index - 1 + slideData.length) % slideData.length)
          }
          className="w-10 cursor-pointer h-10 rounded-full border border-white text-white font-bold hover:bg-white hover:text-black transition"
        >
          &lt;
        </button>
        <button
          onClick={() => setIndex((index + 1) % slideData.length)}
          className="w-10  cursor-pointer h-10 rounded-full border border-white text-white font-bold hover:bg-white hover:text-black transition"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Carousel;
