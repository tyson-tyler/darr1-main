"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

const HeroTitle1 = () => {
  const exploreRef = useRef<HTMLHeadingElement>(null);
  const potencyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "hop", duration: 1.2 } });

    tl.fromTo(
      exploreRef.current,
      {
        y: 100,
        scale: 0.8,
        opacity: 0,
        rotate: -5,
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: 0,
      }
    ).fromTo(
      potencyRef.current,
      {
        y: 100,
        scale: 0.8,
        opacity: 0,
        rotate: 5,
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: 0,
      },
      "<0.4"
    );
  }, []);

  return (
    <div className="text-center flex flex-col justify-center items-center pb-12 pt-10 sm:pt-14 md:pt-16  sm:pb-16  md:pb-20 lg:pb-24 xl:py-28 h-[auto]">
      <h1
        ref={exploreRef}
        className="text-3xl sm:text-4xl md:text-5xl font-semibold lg:text-6xl uppercase tracking-wide text-black"
      >
        Our Limited Edition
      </h1>
      <p
        ref={potencyRef}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl italic font-serif text-gray-700 mt-4"
      >
        Zodiac <span className="px-5 py-2 bg-blue-500 text-white">T-Shirt</span>{" "}
        Collections
      </p>
    </div>
  );
};

export default HeroTitle1;
