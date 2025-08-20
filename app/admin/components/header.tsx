"use client";

import { useState } from "react";
import { useAuth } from "@/context/authcontext";
import { useAdmin } from "@/lib/firebase/admin/read";
import Image from "next/image";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user }: any = useAuth();
  const { data: admin } = useAdmin({ email: user?.email });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const onLogout = async () => {
    try {
      await toast.promise(signOut(auth), {
        error: (e) => e?.message,
        loading: "Loading",
        success: "SuccessFully Logout",
      });
      router.push("/");
    } catch (error) {
      toast.error(error);
    }
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative inline-block text-left">
        <button onClick={toggleDropdown} className="focus:outline-none">
          <Image
            width={40}
            height={40}
            className="object-cover w-[40px] h-[40px] rounded-full"
            src={admin?.image || "/default-avatar.png"}
            alt="User avatar"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
