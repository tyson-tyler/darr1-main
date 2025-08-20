"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

const Loader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const circles = circleRefs.current.filter(Boolean);

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "power2.inOut" },
    });

    circles.forEach((circle, i) => {
      tl.to(
        circle,
        {
          scale: 1.5,
          transformOrigin: "50% 50%",
          fill: i % 2 === 0 ? "#60A5FA" : "#F43F5E", // blue & pink
          filter: "drop-shadow(0px 0px 10px rgba(255,255,255,0.8))",
          duration: 0.8,
        },
        i * 0.15
      );
    });

    gsap.to(loaderRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 6,
      ease: "linear",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      aria-busy="true"
      aria-label="Loading animation"
    >
      <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
        <circle
          ref={(el) => (circleRefs.current[0] = el)}
          cx="30"
          cy="60"
          r="15"
          fill="#60A5FA"
        />
        <circle
          ref={(el) => (circleRefs.current[1] = el)}
          cx="60"
          cy="60"
          r="15"
          fill="#F43F5E"
        />
        <circle
          ref={(el) => (circleRefs.current[2] = el)}
          cx="90"
          cy="60"
          r="15"
          fill="#60A5FA"
        />
        <circle
          ref={(el) => (circleRefs.current[3] = el)}
          cx="60"
          cy="30"
          r="15"
          fill="#F43F5E"
        />
        <circle
          ref={(el) => (circleRefs.current[4] = el)}
          cx="60"
          cy="90"
          r="15"
          fill="#60A5FA"
        />
      </svg>
    </div>
  );
};

const Header1 = () => {
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const hasSeenLoader = localStorage.getItem("hasSeenLoader");

    if (!hasSeenLoader) {
      setLoading(true);

      timerId.current = setTimeout(() => {
        if (loaderRef.current) {
          gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
              setLoading(false);
              localStorage.setItem("hasSeenLoader", "true");
            },
          });
        } else {
          setLoading(false);
          localStorage.setItem("hasSeenLoader", "true");
        }
      }, 3000);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      // Animate logo
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { scale: 0.5, opacity: 0, rotate: -30 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 1,
            ease: "back.out(1.7)",
          }
        );
      }

      // Animate text shimmer
      if (textRef.current) {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        tl.fromTo(
          textRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
        ).to(textRef.current, {
          backgroundPosition: "200% center",
          duration: 2,
          ease: "linear",
        });
      }
    }
  }, [loading]);

  return (
    <>
      {loading && (
        <div ref={loaderRef}>
          <Loader />
        </div>
      )}

      {!loading && (
        <Link href="/" className="flex items-center gap-3 px-4 py-2">
          <Image
            ref={logoRef}
            src="/logo.png"
            alt="logo"
            width={42}
            height={42}
            className="drop-shadow-lg"
          />
        </Link>
      )}
    </>
  );
};

export default Header1;
