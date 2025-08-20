"use client";
import { AuthContextProvider } from "@/context/authcontext";

export default function Layout({ children }: any) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
