"use client";

import { useAuth } from "@/context/authcontext";
import { useOrders } from "@/lib/firebase/orders/read";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProductData {
  name: string;
  images: string[];
}

interface PriceData {
  unit_amount: number;
  product_data: ProductData;
}

interface LineItem {
  price_data: PriceData;
  quantity: number;
}

interface Checkout {
  line_items: LineItem[];
}

interface Order {
  paymentMode?: string;
  status?: string;
  timestampCreate?: {
    toDate: () => Date;
  };
  checkout?: Checkout;
}

export default function Page() {
  const { user } = useAuth();
  const { data: orders, error, isLoading } = useOrders({ uid: user?.uid });

  if (isLoading) {
    return (
      <div className="flex justify-center py-48">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">{String(error)}</div>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {(!orders || orders.length === 0) && (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <Image
            src="/empty.svg"
            width={180}
            height={180}
            alt="Empty"
            className="opacity-80"
          />
          <h2 className="text-xl text-gray-600">You have no orders yet.</h2>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {orders?.map((item: Order, orderIndex: number) => {
          const totalAmount =
            item.checkout?.line_items?.reduce((prev, curr) => {
              return (
                prev + (curr.price_data?.unit_amount / 100) * curr.quantity
              );
            }, 0) ?? 0;

          return (
            <div
              key={`order-${orderIndex}`}
              className="rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between flex-wrap gap-2 mb-4">
                <div className="flex gap-3 flex-wrap items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Order #{orderIndex + 1}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-500">
                    {item.paymentMode}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status === "delivered"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.status ?? "Pending"}
                  </span>
                </div>
                <span className="text-sm text-green-600 font-medium">
                  ₹ {totalAmount.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-3">
                {item.timestampCreate?.toDate().toLocaleString()}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {item.checkout?.line_items?.map((product, idx) => (
                  <div
                    key={`order-${orderIndex}-product-${idx}`}
                    className="flex items-center gap-4"
                  >
                    <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100">
                      {product.price_data?.product_data?.images?.[0] && (
                        <Image
                          src={product.price_data.product_data.images[0]}
                          alt="Product Image"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {product.price_data?.product_data?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ₹ {(product.price_data?.unit_amount / 100).toFixed(2)} x{" "}
                        {product.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
