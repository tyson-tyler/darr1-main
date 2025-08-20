"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

const Cat = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const bottomSectionRef = useRef<HTMLDivElement>(null);
  const hasScrolledToBottom = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://i.pinimg.com/736x/96/2f/a8/962fa88701dd23546d156bbc5a06de87.jpg",
    "https://i.pinimg.com/736x/6d/1d/af/6d1daf0e94e5f02d169844ecf266b554.jpg",
    "https://i.pinimg.com/736x/c9/a4/9c/c9a49c1f1f3e0b46950b3a38f4e7c95c.jpg",
  ];

  const scrollToSlide = (index: number) => {
    const wrapper = wrapperRef.current;
    const slide = slidesRef.current[index];

    if (wrapper && slide) {
      const targetX =
        slide.offsetLeft - (window.innerWidth - slide.offsetWidth) / 2;

      gsap.to(wrapper, {
        x: -targetX,
        duration: 0.75,
        ease: "power3.out",
        onUpdate: updateScaleAndPosition,
      });

      setCurrentIndex(index);

      if (
        index === images.length - 1 &&
        !hasScrolledToBottom.current &&
        bottomSectionRef.current
      ) {
        hasScrolledToBottom.current = true;
        setTimeout(() => {
          bottomSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 600);
      }

      if (index < images.length - 1) {
        hasScrolledToBottom.current = false;
      }
    }
  };

  const updateScaleAndPosition = () => {
    slidesRef.current.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const center = window.innerWidth / 2;
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      const maxDistance = window.innerWidth / 2;
      const scale = 1 + (1 - distance / maxDistance) * 0.75;
      const clampedScale = Math.max(0.5, Math.min(scale, 1.75));
      const offsetX = clampedScale > 1 ? (clampedScale - 1) * 300 : 0;

      gsap.set(slide, { scale: clampedScale, x: offsetX });
    });
  };

  useEffect(() => {
    scrollToSlide(0);
    updateScaleAndPosition();

    const handleResize = () => {
      scrollToSlide(currentIndex);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        ref={sliderRef}
        className="relative w-full h-screen overflow-hidden bg-white"
      >
        {/* Arrows */}
        <button
          className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
          onClick={() => {
            if (currentIndex > 0) scrollToSlide(currentIndex - 1);
          }}
        >
          <ArrowLeftCircle size={48} />
        </button>

        <button
          className="absolute z-10 right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
          onClick={() => {
            if (currentIndex < images.length - 1)
              scrollToSlide(currentIndex + 1);
          }}
        >
          <ArrowRightCircle size={48} />
        </button>

        {/* Slider */}
        <div
          ref={wrapperRef}
          className="flex space-x-10 px-10 items-center h-full transition-transform"
        >
          {images.map((src, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) slidesRef.current[i] = el;
              }}
              className="w-[400px] h-[500px] flex-shrink-0 transition-transform duration-300"
            >
              <img
                src={src}
                alt={`slide-${i}`}
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 👇 Bottom Section */}
    </>
  );
};

export default Cat;
