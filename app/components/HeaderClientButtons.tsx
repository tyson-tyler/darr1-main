"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { GoHeartFill } from "react-icons/go";
import { FaBagShopping } from "react-icons/fa6";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useAuth } from "@/context/authcontext";
import { useUser } from "@/lib/firebase/user/read";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function HeaderClientButtons() {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid || null });

  const heartRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const heartDotRef = useRef<HTMLSpanElement>(null);
  const cartDotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const addHoverAnim = (ref: React.RefObject<HTMLDivElement>) => {
      if (!ref.current) return;

      const icon = ref.current;
      const anim = gsap.to(icon, {
        y: -5,
        scale: 1.15,
        ease: "hop",
        duration: 0.4,
        paused: true,
      });

      const handleEnter = () => anim.play();
      const handleLeave = () => anim.reverse();

      icon.addEventListener("mouseenter", handleEnter);
      icon.addEventListener("mouseleave", handleLeave);

      return () => {
        icon.removeEventListener("mouseenter", handleEnter);
        icon.removeEventListener("mouseleave", handleLeave);
      };
    };

    const cleanups = [heartRef, cartRef].map(addHoverAnim);
    return () => cleanups.forEach((cleanup) => cleanup && cleanup());
  }, []);

  useEffect(() => {
    if (data?.favorites?.length > 0 && heartDotRef.current) {
      gsap.fromTo(
        heartDotRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }

    if (data?.carts?.length > 0 && cartDotRef.current) {
      gsap.fromTo(
        cartDotRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [data?.favorites?.length, data?.carts?.length]);

  return (
    <div className="flex items-center px-1 py-2 space-x-6">
      {/* Favorites Icon */}
      <div ref={heartRef} className="relative group">
        <Link href="/favorites" className="relative">
          <GoHeartFill className="w-5 h-5 cursor-pointer  " />
          {data?.favorites?.length > 0 && (
            <span
              ref={heartDotRef}
              className="absolute -top-1 -right-1 bg-red-500 text-white ring-2 ring-white text-[10px] font-bold w-3 h-3 flex items-center justify-center rounded-full"
            >
              {data?.favorites?.length}
            </span>
          )}
        </Link>
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Favorites
        </span>
      </div>

      {/* Cart Icon */}
      <div ref={cartRef} className="relative group">
        <Link href="/cart" className="relative">
          <FaBagShopping className="w-5 h-5 cursor-pointer " />
          {data?.carts?.length > 0 && (
            <span
              ref={cartDotRef}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-3 h-3 flex items-center justify-center rounded-full ring-2 ring-white"
            >
              {data?.carts?.length}
            </span>
          )}
        </Link>
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Cart
        </span>
      </div>
    </div>
  );
}
