"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const counts = [15, 25, 65, 89, 99];

// Replace this with your actual logo component or image import
const DrottLogo = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4" />
    <text
      x="50%"
      y="55%"
      textAnchor="middle"
      fill="white"
      fontSize="36"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      dominantBaseline="middle"
    >
      drott
    </text>
  </svg>
);

const CountIntro = ({ onComplete }: { onComplete: () => void }) => {
  const countRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        // Animate container fade out after all counts finished
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: onComplete,
        });
      },
    });

    counts.forEach((target) => {
      timeline.to(
        {},
        {
          duration: 1.2,
          onUpdate: function () {
            const progress = this.progress();
            const currentValue = Math.floor(progress * target);
            setCurrentCount(currentValue);
          },
          onComplete: () => setCurrentCount(target),
          ease: "power1.out",
        }
      );
      timeline.to({}, { duration: 0.2 }); // short pause between counts
    });

    // Make sure count ends exactly at last number
    timeline.call(() => setCurrentCount(counts[counts.length - 1]));

    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50"
      style={{ opacity: 1 }}
    >
      <div className="mb-12">
        <DrottLogo />
      </div>
      <div
        ref={countRef}
        className="text-white font-bold text-[10vw] md:text-[15vw] select-none"
      >
        {currentCount}
      </div>
    </div>
  );
};

export default CountIntro;
