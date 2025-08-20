"use client";
import React, { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";

const TopHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        // scrolling down
        setIsVisible(false);
      } else {
        // scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50  transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-around w-full h-[40px] text-white dark:bg-gray-800 dark:text-white bg-gray-500">
        <div className="flex text-xs justify-center items-center font-thin text-gray-400">
          Free Delivery on Your First Order{" "}
          <FaShippingFast className="w-3 h-3 ml-1" />
        </div>
        <div className="justify-center items-center md:-[30px] lg:h-[40px] md:flex hidden">
          <div className="text-xs w-[120px] flex justify-center items-center text-gray-400 hover:text-purple-500 border-l border-gray-400 h-[40px] cursor-pointer">
            Help & FaQ
          </div>
          <div className="text-xs w-[100px] flex justify-center items-center text-gray-400 hover:text-purple-500 border-l border-gray-400 h-[40px] cursor-pointer">
            Account
          </div>
          <div className="text-xs w-[100px] flex justify-center items-center text-gray-400 hover:text-purple-500 border-l border-gray-400 h-[40px] cursor-pointer">
            EN
          </div>
          <div className="text-xs w-[100px] flex justify-center items-center text-gray-400 hover:text-purple-500 border-l border-gray-400 h-[40px] cursor-pointer border-r-1">
            INR
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
