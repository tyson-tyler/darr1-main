"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

const WeddingBanner2 = () => {
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const imageLeftRef = useRef(null);
  const imageRightRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    tl.from(imageLeftRef.current, { x: -100, opacity: 0 })
      .from(imageRightRef.current, { x: 100, opacity: 0 }, "<")
      .from(titleRef.current, { y: 50, opacity: 0 }, "<+0.3")
      .from(buttonRef.current, { y: 20, opacity: 0 }, "<+0.2");
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Left Image */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full z-0"
        ref={imageLeftRef}
      >
        <Image
          src="/new2.jpg"
          alt="Wedding Left"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Image */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full z-1"
        ref={imageRightRef}
      >
        <Image
          src="/new1.jpg"
          alt="Wedding Right"
          fill
          className="object-cover"
        />
      </div>

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-10"></div>

      {/* Center Text & Button */}
      <div className="z-20 text-center px-6 md:px-20">
        <h1
          ref={titleRef}
          className="text-white text-4xl md:text-6xl font-serif font-medium mb-6 drop-shadow-lg"
        >
          The <span className="italic">OverSized</span> T-Shirts
        </h1>
        <Link href="/shop">
          <button
            ref={buttonRef}
            className="px-6 py-3 border  cursor-pointer z-10 max-w-2xl text-white border-white hover:bg-white hover:text-black transition-all duration-300"
          >
            SHOP NOW
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WeddingBanner2;
