"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { videos } from "./videos";
import gsap from "gsap";
import MainHeading from "../../navbar/heading";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const HeroSlider = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden ">
      <div>
        <MainHeading />
      </div>
    </div>
  );
};

export default HeroSlider;
