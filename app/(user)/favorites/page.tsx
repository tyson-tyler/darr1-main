"use client";

import { ProductCard } from "@/app/components/home/Product";
import { useAuth } from "@/context/authcontext";
import { useProduct } from "@/lib/firebase/products/read";
import { useUser } from "@/lib/firebase/user/read";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const { user }: any = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });

  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  return (
    <main className="flex flex-col gap-3 justify-center items-center p-5">
      <h1 className="text-2xl font-semibold">Favorites</h1>
      {(!data?.favorites || data?.favorites?.length === 0) && (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <Image
              src="/heart.svg"
              width={180}
              height={180}
              alt="Empty"
              className="opacity-80"
            />
          </div>
          <h1 className="text-gray-600 font-semibold">
            Please Add Products To Favorites
          </h1>
        </div>
      )}
      <div className="p-5 w-full max-w-[100rem] gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {data?.favorites?.map((productId: any) => {
          return <ProductItem productId={productId} key={productId} />;
        })}
      </div>
    </main>
  );
}

function ProductItem({ productId }: any) {
  const { data: product } = useProduct({ productId: productId });
  return <ProductCard product={product} />;
}
