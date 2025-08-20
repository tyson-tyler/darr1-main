"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  const digitsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";

      // Animate digits sliding up into view
      gsap.fromTo(
        digitsRef.current,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      // Animate divider scale from 0 to 1 vertically
      if (dividerRef.current) {
        gsap.to(dividerRef.current, {
          scaleY: 1,
          duration: 1,
          ease: "power3.out",
        });
      }
    }

    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "auto";
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden z-50 bg-white relative">
      <div className="overlay absolute inset-0 flex w-full h-full">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="block flex-1 h-full bg-white" />
        ))}
      </div>

      <div
        ref={dividerRef}
        className="divider absolute top-0 left-1/2 w-px h-full bg-black origin-top scale-y-0 -translate-x-1/2"
      ></div>

      <div className="spinner-container absolute bottom-[10%] left-1/2 -translate-x-1/2">
        <div className="spinner w-12 h-12 border-[1.2px] border-black border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div className="counter absolute top-1/2 left-1/2 flex gap-2 -translate-x-1/2 text-black -translate-y-1/2 z-20">
        {["00", "27", "65", "98", "99"].map((num, i) => (
          <div key={i} className="count flex relative">
            {num.split("").map((n, j) => (
              <div
                className="digit overflow-hidden h-[15rem] w-14 flex justify-center"
                key={j}
              >
                <h1
                  ref={(el) => {
                    if (el) digitsRef.current.push(el);
                  }}
                  className="text-[15rem] font-semibold"
                  // Removed translate-y-[120%] to let gsap animate from yPercent 120
                >
                  {n}
                </h1>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
