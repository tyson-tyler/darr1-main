"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    heading: "Wear Your Zodiac Power.",
    text: "Tap into cosmic energy with style tailored to your zodiac sign.",
    image: "https://images.hdqwalls.com/wallpapers/celine-farach-2025-hj.jpg",
  },
  {
    heading: "Style Written in the Stars.",
    text: "Let your celestial personality reflect in your fashion.",
    image:
      "https://images.hdqwalls.com/wallpapers/white-top-girl-looking-at-viewer-6k.jpg",
  },
  {
    heading: "Born to Shine in Your Sign.",
    text: "Shine brighter with apparel inspired by your sign's strength.",
    image:
      "https://images.hdqwalls.com/wallpapers/denim-jacket-girl-sitting-on-chair-hj.jpg",
  },
  {
    heading: "Astrology Meets Attitude.",
    text: "Bold designs infused with star sign symbolism.",
    image:
      "https://images.hdqwalls.com/wallpapers/pretty-girl-in-hoodie-looking-at-the-viewer-pq.jpg",
  },
  {
    heading: "Your Sign, Your Statement.",
    text: "Make your mark with apparel aligned to your identity.",
    image:
      "https://images.hdqwalls.com/wallpapers/fusialka-x-k2-pony-4k-vm.jpg",
  },
];

export default function Minimal() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setIndex(newIndex);

      // Animate text and image on slide change
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      );
    });
  }, [emblaApi]);

  useEffect(() => {
    const timer = setInterval(() => scrollNext(), 4000);
    return () => clearInterval(timer);
  }, [scrollNext]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-cinzel text-white">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((slide, i) => (
            <div
              className="embla__slide min-w-full h-full flex flex-col-reverse md:flex-row"
              key={i}
            >
              {/* Image Section */}
              <div
                className="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center transition-all duration-700"
                ref={imageRef}
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Text Section */}
              <div
                className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-6 md:px-16 py-10 md:py-0"
                ref={textRef}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-5xl font-bold mb-4 uppercase"
                >
                  {slide.heading}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-base md:text-lg text-gray-300"
                >
                  {slide.text}
                </motion.p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-50 flex space-x-4">
        <button
          onClick={scrollPrev}
          className="bg-white/10 cursor-pointer backdrop-blur border border-white/30 rounded-full p-3 hover:bg-white/20 transition"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={scrollNext}
          className="bg-white/10 backdrop-blur cursor-pointer border border-white/30 rounded-full p-3 hover:bg-white/20 transition"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
