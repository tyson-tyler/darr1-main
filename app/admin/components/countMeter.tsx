"use client";

import { useProductCount } from "@/lib/firebase/products/count/read_client";
import { useUsersCount } from "@/lib/firebase/user/read_count";
import { useOrdersCounts } from "@/lib/firebase/orders/read_count";

export default function CountMeter() {
  const { data: totalProduct } = useProductCount();
  const { data: totalUsers } = useUsersCount();
  const { data: ordersCounts } = useOrdersCounts();
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <Card imgURL={"/hate.svg"} title={"Products"} value={totalProduct ?? 0} />
      <Card
        imgURL={"/received.svg"}
        title={"Orders"}
        value={ordersCounts?.totalOrders ?? 0}
      />
      <Card
        imgURL={"/profit.svg"}
        title={"Revenue"}
        value={`₹ ${(ordersCounts?.totalRevenue ?? 0) / 100}`}
      />
      <Card imgURL={"/pic.svg"} title={"Customer"} value={totalUsers ?? 0} />
    </section>
  );
}

function Card({ title, value, imgURL }: any) {
  return (
    <div className="flex gap-2 px-4 py-2 bg-white shadow rounded-xl w-full justify-between items-center">
      <div className="flex flex-col">
        <h1 className="font-semibold text-xl">{value}</h1>
        <h1 className="text-sm text-gray-700">{title}</h1>
      </div>
      <img className="h-10" src={imgURL} alt={title} />
    </div>
  );
}
