"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FaHome,
  FaBoxOpen,
  FaThList,
  FaShoppingCart,
  FaUsers,
  FaStar,
  FaTags,
  FaLayerGroup,
  FaBars,
} from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";

const Sidebar = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
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
      toast.error(error?.message);
    }
  };

  const menuList = [
    { id: 1, name: "Home", link: "/admin", icon: <FaHome /> },
    { id: 2, name: "Product", link: "/admin/product", icon: <FaBoxOpen /> },
    // {
    //   id: 3,
    //   name: "Categories",
    //   link: "/admin/catergories",
    //   icon: <FaThList />,
    // },
    { id: 4, name: "Orders", link: "/admin/orders", icon: <FaShoppingCart /> },
    // { id: 5, name: "Customers", link: "/admin/customers", icon: <FaUsers /> },
    // { id: 6, name: "Reviews", link: "/admin/reviews", icon: <FaStar /> },
    // { id: 7, name: "Discounts", link: "/admin/discounts", icon: <FaTags /> },
    {
      id: 8,
      name: "Collections",
      link: "/admin/collections",
      icon: <FaLayerGroup />,
    },
    {
      id: 9,
      name: "Admins",
      link: "/admin/admins",
      icon: <RiAdminFill />,
    },
  ];

  // 🧠 Detect click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <>
      {/* Hamburger icon for small screens */}
      <div className="md:hidden absolute flex items-center bg-gray-900 mx-2 my-2 rounded-md text-white p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="cursor-pointer"
        >
          <FaBars className="text-2xl" />
        </button>
      </div>

      {/* Sidebar */}
      <section
        ref={sidebarRef}
        className={`bg-gray-950 text-white px-5 py-3 h-screen overflow-hidden flex flex-col w-[290px] z-50 fixed top-0 left-0 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:flex`}
      >
        <div className="flex items-center mb-6">
          <Image src="/logo.png" width={40} height={40} alt="Logo" />
          <span className="lg:flex mt-1 text-lg ml-3 hidden">The Drott</span>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {menuList.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={item.id}
                href={item.link}
                className={`flex items-center gap-3 text-sm px-3 py-4 rounded-lg transition-all ease-in-out duration-200 ${
                  isActive ? "bg-purple-700" : "hover:bg-gray-800"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg ml-2">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div>
          <button
            onClick={onLogout}
            className="w-full flex cursor-pointer items-center gap-3 text-sm px-3 py-4 rounded-lg transition-all ease-in-out duration-200 bg-gray-900 hover:bg-purple-700 text-white"
          >
            <IoLogOut className="text-lg ml-2" />
            <span>Logout</span>
          </button>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
