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
    <div className="text-center flex flex-col justify-center items-center pb-10 pt-8 sm:pt-10 md:pt-12 sm:pb-12 md:pb-14 lg:pb-16 xl:py-20 h-auto">
      <h1
        ref={exploreRef}
        className="text-xl sm:text-2xl md:text-3xl font-semibold lg:text-4xl uppercase tracking-wide text-black"
      >
        Choose By Season
      </h1>
    </div>
  );
};

export default HeroTitle1;
