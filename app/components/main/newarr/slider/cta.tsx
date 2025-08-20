"use client";

import { useRef, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useRouter } from "next/navigation";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "M0,0 C0.25,1.5 0.5,1 1,1");
// Custom ease

export default function ExploreCTA() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    btn.addEventListener("mouseenter", () => {
      gsap.fromTo(
        btn,
        { y: 0 },
        {
          y: -10,
          ease: "hop",
          duration: 0.4,
        }
      );
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        y: 0,
        ease: "hop",
        duration: 0.4,
      });
    });

    return () => {
      btn.removeEventListener("mouseenter", () => {});
      btn.removeEventListener("mouseleave", () => {});
    };
  }, []);

  return (
    <div className="flex justify-center items-center py-12">
      <div
        ref={buttonRef}
        onClick={() => router.push("/categories/4q1leS8463lzJkvzs3Fx")}
        className="flex items-center justify-between bg-neutral-100 rounded-full w-[90%] max-w-2xl py-4 px-6 cursor-pointer shadow-md transition-all duration-300"
      >
        <p className="text-sm md:text-base font-medium text-center w-full tracking-wide underline underline-offset-2">
          EXPLORE ALL PRODUCTS
        </p>
        <div className="bg-neutral-800 text-white rounded-full w-10 h-9 flex items-center justify-center ml-4">
          <FaArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
