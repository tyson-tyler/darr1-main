import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline({
    delay: 0.3,
    defaults: {
      ease: "hop",
    },
  });

  const counts = document.querySelectorAll(".count");

  counts.forEach((count, index) => {
    const digits = count.querySelectorAll(".digit h1");
    tl.to(
      "digits",
      {
        y: "0%",
        duration: 1,
        stagger: 0.075,
      },
      index * 1
    );

    if (index < counts.length) {
      tl.to(
        digits,
        {
          y: "-100%",
          duration: 1,
          stagger: 0.075,
        },
        index * 1 + 1
      );
    }
  });

  tl.to("spinner", {
    opacity: 0,
    duration: 0.3,
  });

  tl.to(
    ".word h1",
    {
      y: "0%",
      duration: 1,
    },
    "<"
  );

  tl.to(".divider", {
    scaleY: "100%",
    duration: 1,
    onComplete: () =>
      gsap.to(".divider", { opacity: 0, duration: 0.4, delay: 0.3 }),
  });

  tl.to("#word-1 h1", {
    y: "100%",
    duration: 1,
    delay: 0.3,
  });
  tl.to(
    "#word-2 h1",
    {
      y: "-100%",
      duration: 1,
    },
    "<"
  );
  tl.to("block", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0% )",
    duration: 1,
    stagger: 0.1,
    delay: 0.75,
    onStart: () => gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" }),
  });

  tl.to(
    [".nav", ".line h1", ".line p"],
    {
      y: "0%",
      duration: 1.5,
      stagger: 0.2,
    },
    "<"
  );
  tl.to(
    [".cta", ".cta-icon"],
    {
      scale: 1,
      duration: 1.5,
      stagger: 0.75,
      delay: 0.75,
    },
    "<"
  );

  tl.to(
    ".cta-label p ",
    {
      y: "0%",
      duration: 1.5,
      delay: 0.5,
    },
    "<"
  );
});

let target = 0;
let current = 0;
let ease = 0.075;

const slider = document.querySelector(".slider1");
const sliderWrapper = document.querySelector(".slider-wrapper1");
const slides = document.querySelector(".slide1");

let maxScroll = sliderWrapper.offsetWidth - window.innerWidth;

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function updateScaleAndPosition() {
  slides.forEach((slide) => {
    const rect = slide.getBoundingClientReact();
    const centerPosition = (rect.left + rect.right) / 2;
    const distanceFromCenter = centerPosition - window.innerWidth / 2;

    let scale, offsetX;

    if (distanceFromCenter > 0) {
      scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
      offsetX = (scale - 1) * 300;
    } else {
      scale = Math.max(
        0.5,
        1 - Math.abs(distanceFromCenter) / window.innerWidth
      );
      offsetX = 0;
    }

    gsap.set(slide, { scale: scale, x: offsetX });
  });
}

function update() {
  current = lerp(current, target, ease);
  gsap.set(".slider-wrapper1", {
    x: -current,
  });

  updateScaleAndPosition();
  requestAnimationFrame(update);
}

window.addEventListener("resize", () => {
  maxScroll = sliderWrapper.offsetWidth - window.innerWidth;
});

window.addEventListener("wheel", (e) => {
  target += e.deltaY;
  target = Math.max(0, target);
  target = Math.min(maxScroll, target);
});

///ass

var sickPrimary = {
  autoplay: true,
  autoplaySpeed: 2400,
  slidesToShow: 2,
  slidesToScroll: 1,
  speed: 1800,
  cssEase: "cubic-bezier(.84, 0, .08, .99)",
  asNavFor: ".text-slider",
  centerMode: true,
  prevArrow: $(".prev"),
  nextArrow: $(".next"),
};

var sickSecondary = {
  autoplay: true,
  autoplaySpeed: 2400,
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 1800,
  cssEase: "cubic-bezier(.84, 0, .08, .99)",
  asNavFor: ".image-slider",
  centerMode: true,
  prevArrow: $(".prev"),
  nextArrow: $(".next"),
};

$(".image-slider").slick(sickPrimary);
$(".text-slider").slick(sickSecondary);
