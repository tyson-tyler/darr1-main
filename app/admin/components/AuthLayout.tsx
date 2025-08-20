"use client";

import { useAuth } from "@/context/authcontext";
import Sidebar from "./sidebar";
import { useAdmin } from "@/lib/firebase/admin/read";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import Header from "./header";

const AdminLayout = ({ children }: any) => {
  const { user } = useAuth();

  const { data: admin, error, isLoading } = useAdmin({ email: user?.email });
  if (!admin) {
    return (
      <div className="h-screen w-screen flex flex-col gap-2 justify-center items-center">
        <h1 className="font-bold">You are not admin!</h1>
        <h1 className="text-gray-600 text-sm">{user?.email}</h1>
        <button
          className="px-3 text-xs py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          onClick={async () => {
            await signOut(auth);
          }}
        >
          Logout
        </button>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  return (
    <main className="flex ">
      <Header />
      <Sidebar />
      <section className="lg:ml-[34px]   w-full mx-6 mt-3 pt-3 py-4 md:ml-[30px] ml-0">
        {children}
      </section>
    </main>
  );
};
export default AdminLayout;
