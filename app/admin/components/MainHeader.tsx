"use client";
import React, { useState, useEffect } from "react";
import { Play, Info, Volume2, VolumeX, ShoppingBag } from "lucide-react";

import Image from "next/image";

const MainHeader = () => {
  const [muted, setMuted] = useState(true);

  // Prevent rendering before random index is set

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        src={"/1.mp4"}
        autoPlay
        muted={muted}
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-24 px-4 sm:px-8 lg:px-16 max-w-4xl mx-auto lg:mx-0 lg:items-start items-center text-center lg:text-left">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-wider text-white px-4 py-2 rounded-md">
          Perfect Fit
        </h1>

        <p className="mt-3 sm:mt-4 text-gray-200 text-sm sm:text-lg lg:text-xl max-w-2xl leading-relaxed drop-shadow-lg">
          Elevate your everyday look with our premium fit t-shirts — designed
          for comfort, style, and confidence. Perfect for casual outings or
          layering with your favorite fashion pieces.
        </p>

        <div className="mt-5 sm:mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
          <button className="flex items-center gap-2 bg-white py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-9 text-black font-semibold rounded-md hover:bg-gray-300 transition text-sm sm:text-base lg:text-lg cursor-pointer">
            <ShoppingBag size={18} className="sm:w-5 sm:h-5" /> Buy Now
          </button>
          <button className="flex items-center gap-2 bg-gray-600/80 text-white font-semibold py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-9 rounded-md hover:bg-gray-500 transition text-sm sm:text-base lg:text-lg cursor-pointer">
            <Info size={18} className="sm:w-5 sm:h-5" /> More Info
          </button>
        </div>
      </div>

      {/* Volume Toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10 bg-black/50 p-2 sm:p-3 rounded-full text-white hover:bg-black/70 transition cursor-pointer"
      >
        {muted ? (
          <VolumeX size={20} className="sm:w-6 sm:h-6" />
        ) : (
          <Volume2 size={20} className="sm:w-6 sm:h-6" />
        )}
      </button>
    </div>
  );
};

export default MainHeader;
