"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { BiSearch, BiMenu, BiX } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { AuthContextProvider, useAuth } from "@/context/authcontext";
import HeaderClientButtons from "../HeaderClientButtons";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/categories/1aIpbpPn4qWIDAm59MWk" },
  { label: "NEW PRODUCT", href: "/comman/review" },

  { label: "ABOUT", href: "/comman/about" },
  { label: "CONTACT", href: "/comman/contact" },
];

const Mainnav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuth();
  const router = useRouter();
  const navRef = useRef(null);
  const menuRef = useRef(null);

  const onHandleAuthButton = () => {
    router.push("/auth/auth/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
      );
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [menuOpen]);

  return (
    <header
      ref={navRef}
      className={classNames(
        "fixed top-0 left-0 z-[500] w-full transition-all duration-300",
        scrolled
          ? "bg-white shadow-md text-black"
          : "top-4 text-white bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-6 md:px-20 h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={scrolled ? "/lightlogo.png" : "/logo.png"}
            alt="logo"
            width={42}
            height={42}
            priority
          />
          <span
            className={classNames(
              "text-xl md:flex items-center gap-1 font-semibold tracking-wide hidden",
              {
                "text-black": scrolled,
                "text-white": !scrolled,
              }
            )}
          >
            The{" "}
            <p
              className={classNames(
                "tracking-tight leading-tight font-serif italic",
                { "text-black": scrolled, "text-white": !scrolled }
              )}
            >
              Drott
            </p>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-8 font-medium text-sm">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="relative group cursor-pointer"
            >
              <span className="text-[13px] tracking-wide">{label}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5 ">
          <Link
            href="/search"
            className={
              scrolled
                ? "hover:text-purple-400 transition text-black"
                : "hover:text-purple-400 transition text-white"
            }
          >
            <BiSearch size={20} />
          </Link>

          <AuthContextProvider>
            <HeaderClientButtons />
          </AuthContextProvider>

          <Link
            href="/account"
            className={
              scrolled
                ? "hover:text-purple-400 transition text-black"
                : "hover:text-purple-400 transition text-white"
            }
          >
            <FaUser size={18} />
          </Link>

          {/* Hamburger */}
          <button
            className={
              scrolled ? "lg:hidden text-black" : "lg:hidden text-white"
            }
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <BiX size={26} /> : <BiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`lg:hidden bg-white text-black overflow-hidden transition-all duration-300 ${
          menuOpen ? "py-5 px-6" : "h-0 px-6"
        }`}
      >
        <nav className="flex flex-col gap-4 text-sm font-semibold">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="relative group cursor-pointer"
            >
              <span className="text-[13px] tracking-wide">{label}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Mainnav;
