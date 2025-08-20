"use client";

import Image from "next/image";
import Link from "next/link";

const WeddingBanner = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Left Image - Only visible on md+ screens */}
      <div className="hidden md:block absolute top-0 left-0 w-1/2 h-full z-0">
        <Image
          src="/new2.jpg"
          alt="Wedding Left"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Image - Full width on small screens, half on md+ */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0">
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
        <h1 className="text-white text-4xl md:text-6xl font-serif font-medium mb-6 drop-shadow-lg">
          The <span className="italic">Zodiac Special</span> Edition
        </h1>
        <Link href="/collections/YQNr23CZvGebwraougY3">
          <button className="px-6 py-3 border cursor-pointer z-10 text-white border-white hover:bg-white hover:text-black transition-all duration-300">
            SHOP NOW
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WeddingBanner;
