"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ExploreCTA from "../main/newarr/slider/cta";

gsap.registerPlugin(ScrollTrigger);

export default function Categories({ categories }: any) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!categories || categories.length === 0) return null;

  const list =
    categories.length <= 2
      ? [...categories, ...categories, ...categories]
      : categories;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".category-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 125%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-12 justify-center overflow-hidden md:p-12 p-6 pt-0"
    >
      {/* Use grid here to layout category cards */}
      <div className="flex flex-wrap  justify-center items-center gap-8">
        {list.map((category: any) => (
          <div key={category.id} className="category-card">
            <Link href={`/categories/${category?.id}`}>
              <div className="group cursor-pointer transition-transform duration-300 hover:scale-105">
                <div className="relative w-full h-[500px] rounded-md overflow-hidden">
                  <Image
                    width={600}
                    height={600}
                    src={category?.image}
                    alt={category?.name || "Category"}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="mt-2 text-lg md:text-xl font-semibold text-gray-800 group-hover:text-black transition-colors text-center">
                  {category?.name}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="text-center mb-3 ">
        <ExploreCTA />
      </div>
    </div>
  );
}
