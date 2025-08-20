"use client";

import { AuthContextProvider, useAuth } from "@/context/authcontext";
import AdminLayout from "./components/AuthLayout";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { FaCircleUp } from "react-icons/fa6";

// Annotate props type
type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthContextProvider>
      <AdminChecking>{children}</AdminChecking>
    </AuthContextProvider>
  );
};
export default Layout;

function AdminChecking({ children }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <FaCircleUp className="w-12 h-12 animate-spin" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Please Login First
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
