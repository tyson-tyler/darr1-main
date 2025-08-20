"use client";

import { AuthContextProvider, useAuth } from "@/context/authcontext";
import Footer from "../components/footer/footer";
import Productnav from "../components/navbar/ProductNav";

import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";

export default function Layout({ children }: any) {
  return (
    <main>
      <AuthContextProvider>
        <Productnav />

        <UserChecking>
          <section className="min-h-screen pt-[100px]">{children}</section>
        </UserChecking>
      </AuthContextProvider>
      <Footer />
    </main>
  );
}

function UserChecking({ children }: any) {
  const { user, isLoading }: any = useAuth();
  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2Icon className="animate-spin w-6 h-6" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-center gap-6 text-center">
          {/* Top Illustration */}
          <div className="w-40 h-40 relative">
            <Image
              src="login.svg"
              alt="Login Illustration"
              fill
              className="object-contain"
            />
          </div>

          {/* Message */}
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              You're not logged in
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Please log in to view your orders and account information.
            </p>
          </div>

          {/* Button */}
          <Link href="/auth/login">
            <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm md:text-base px-6 py-2 rounded-full transition-all">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
