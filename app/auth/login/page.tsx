"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "../../../public/logo.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import Google from "../../../public/google.svg";
import Facebook from "../../../public/facebook.svg";
import Instagram from "../../../public/insta.svg";

import Link from "next/link";
import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";

const page = () => {
  const images = [
    "https://mkt.cdnpk.net/web-app/media/freepik-15-2000.webp",
    "https://mkt.cdnpk.net/web-app/media/freepik-26-2000.webp",
    "https://mkt.cdnpk.net/web-app/media/freepik-3-2000.webp",
  ];
  const router = useRouter();

  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left slider section (hidden on small screens) */}
      <div className="hidden h-screen lg:flex w-[70%]">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          className="w-full h-screen"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-screen bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${src})` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center items-center bg-black text-white h-screen w-full">
        <div className="px-2 flex flex-col justify-center mb-5 items-center gap-2">
          <Image src={Logo} alt="hello" width={60} height={60} />
          <span className="text-4xl font-semibold text-white">The Drott</span>
        </div>
        <div className="flex justify-center items-center mb-7">
          <h1 className="text-center text-2xl">Welcome Back</h1>
        </div>

        <div className="flex justify-center flex-col gap-5 items-center w-[70%]">
          <SignWithGoogleComponent />
          <button className="h-[50px] flex justify-center items-center gap-3 bg-white hover:bg-gray-200 text-black rounded-4xl cursor-pointer w-full">
            <Image src={Facebook} alt="GitHub Light" width={20} height={20} />
            <span>Continue with Facebook</span>
          </button>
          <button className="h-[50px] bg-rose-500 hover:bg-rose-600 flex justify-center items-center gap-3 rounded-4xl cursor-pointer w-full">
            <Image
              src={Instagram}
              width={20}
              height={20}
              alt="hello"
              className="text-black"
            />
            Continue with Instagram
          </button>
        </div>

        <div className="mt-[40px] w-[340px] text-center text-sm">
          By continuing, you agree to Drrot{" "}
          <b>Terms of Use and Privacy Policy.</b>
        </div>

        <div className="flex text-center gap-1 absolute bottom-4">
          Don’t have an account?{" "}
          <Link href="/auth/login" className="text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;

function SignWithGoogleComponent() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
      toast.success("Successfully signed in!");
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="h-[50px] bg-gray-800 hover:bg-gray-900 transition-colors flex justify-center items-center gap-3 rounded-4xl cursor-pointer w-full disabled:opacity-50"
    >
      <Image src={Google} width={20} height={20} alt="Google logo" />
      <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
    </button>
  );
}
