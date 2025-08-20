"use client";

import { AuthContextProvider, useAuth } from "@/context/authcontext";
import { useUser } from "@/lib/firebase/user/read";
import { Loader2 } from "lucide-react";

import { useSearchParams } from "next/navigation";

export default function Layout({ children }: any) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  const { user } = useAuth();
  const { data, error, isLoading } = useUser({ uid: user?.uid });

  console.log(data?.carts);

  if (isLoading) {
    return (
      <div>
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (type === "cart" && !data?.carts && data?.carts?.length === 0) {
    return (
      <div>
        <h2>Your Cart Is Empty</h2>
      </div>
    );
  }
  if (type === "buynow" && !productId) {
    return (
      <div>
        <h2>Product Not Found!</h2>
      </div>
    );
  }

  return <>{children}</>;
}
