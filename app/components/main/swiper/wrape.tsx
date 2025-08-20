"use client";
import React, { useEffect, useState } from "react";

import Carousel from "./dump";

const BgRotatingSection = () => {
  const bgColors = [
    [
      "bg-gradient-to-t from-purple-700 via-purple-800 to-purple-900",
      "bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900",
      "bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900",
      "bg-gradient-to-l from-purple-700 via-purple-800 to-purple-900",
    ],
    [
      "bg-gradient-to-t from-blue-700 via-blue-800 to-blue-900",
      "bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900",
      "bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900",
      "bg-gradient-to-l from-blue-700 via-blue-800 to-blue-900",
    ],
    [
      "bg-gradient-to-t from-red-700 via-red-800 to-red-900",
      "bg-gradient-to-r from-red-700 via-red-800 to-red-900",
      "bg-gradient-to-b from-red-700 via-red-800 to-red-900",
      "bg-gradient-to-l from-red-700 via-red-800 to-red-900",
    ],
    [
      "bg-gradient-to-t from-green-700 via-green-800 to-green-900",
      "bg-gradient-to-r from-green-700 via-green-800 to-green-900",
      "bg-gradient-to-b from-green-700 via-green-800 to-green-900",
      "bg-gradient-to-l from-green-700 via-green-800 to-green-900",
    ],
    [
      "bg-gradient-to-t from-yellow-600 via-yellow-700 to-yellow-800",
      "bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800",
      "bg-gradient-to-b from-yellow-600 via-yellow-700 to-yellow-800",
      "bg-gradient-to-l from-yellow-600 via-yellow-700 to-yellow-800",
    ],
  ];

  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % bgColors.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000`}>
      <Carousel />
    </div>
  );
};

export default BgRotatingSection;
