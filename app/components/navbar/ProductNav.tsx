"use client";

import Image from "next/image";
import React, { useState } from "react";
import { BiSearch, BiMenu, BiX } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { FaBagShopping } from "react-icons/fa6";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { AuthContextProvider, useAuth } from "@/context/authcontext";

import Link from "next/link";
import { FaHeart, FaUser } from "react-icons/fa";
import HeaderClientButtons from "../HeaderClientButtons";
import { useUser } from "@/lib/firebase/user/read";

const Productnav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useAuth();
  const router = useRouter();
  const onHandleAuthButton = () => {
    router.push("/auth/auth/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div
      className={classNames(
        "fixed h-[70px] left-0 w-full z-150 bg-white transition-all duration-300 shadow-2xl"
      )}
    >
      <div className="flex items-center justify-between px-[20px] md:px-[60px] h-[70px]">
        {/* Logo and Desktop Nav */}
        <div className="flex items-center gap-2">
          <Link href={"/"} className="flex justify-center items-center gap-2">
            <Image src="/lightlogo.png" alt="logo" width={40} height={40} />
            <span className="text-xl font-semibold hidden md:flex">
              The Drott
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 font-thin text-sm uppercase ml-[80px]">
            <Link href="/" className="cursor-pointer">
              Home
            </Link>
            <Link
              href="/categories/1aIpbpPn4qWIDAm59MWk"
              className="cursor-pointer"
            >
              Shop
            </Link>

            <Link href="/comman/about" className="cursor-pointer">
              About
            </Link>
            <Link href="/comman/contact" className="cursor-pointer">
              Contact
            </Link>
          </div>
        </div>

        {/* Right-side icons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative group">
              <Link href="/search">
                <BiSearch className="w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-purple-400" />
              </Link>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Search
              </span>
            </div>
            <AuthContextProvider>
              <HeaderClientButtons />
            </AuthContextProvider>

            <div className="relative group">
              <Link href="/account">
                <FaUser className="w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-purple-400" />
              </Link>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Account
              </span>
            </div>
          </div>

          {/* Hamburger Icon on Mobile */}
          <div className="md:hidden">
            {menuOpen ? (
              <BiX className="w-6 h-6 cursor-pointer" onClick={toggleMenu} />
            ) : (
              <BiMenu className="w-6 h-6 cursor-pointer" onClick={toggleMenu} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black text-white px-4 pb-4"
          >
            <div className="flex flex-col gap-4 font-semibold pt-4">
              <Link href="/" className="cursor-pointer">
                Home
              </Link>
              <Link
                href="/categories/1aIpbpPn4qWIDAm59MWk"
                className="cursor-pointer"
              >
                Shop
              </Link>
              

              <Link href="/comman/blog" className="cursor-pointer">
                Blog
              </Link>
              <Link href="/comman/about" className="cursor-pointer">
                About
              </Link>
              <Link href="/comman/contact" className="cursor-pointer">
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Productnav;
