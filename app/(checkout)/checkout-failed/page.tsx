// app/(routes)/checkout-failed/page.tsx

import Header from "@/app/admin/components/header";
import Footer from "@/app/components/footer/footer";
import Productnav from "@/app/components/navbar/ProductNav";
import { adminDB } from "@/lib/firebase_admin";
import Link from "next/link";

type CheckoutSession = {
  id: string;
  url?: string;
};

const fetchCheckout = async (checkoutId: string): Promise<CheckoutSession> => {
  const list = await adminDB
    .collectionGroup("checkout_sessions")
    .where("id", "==", checkoutId)
    .get();

  if (list.empty) {
    throw new Error("Invalid Checkout ID");
  }

  return list.docs[0].data() as CheckoutSession;
};

export default async function Page({
  searchParams,
}: {
  searchParams: { checkout_id: string };
}) {
  const { checkout_id } = searchParams;
  const checkout = await fetchCheckout(checkout_id);

  return (
    <main>
      <Productnav />
      <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
        <div className="flex justify-center w-full">
          <img src="/wrong.svg" className="h-48" alt="Payment Failed" />
        </div>
        <h1 className="text-2xl font-semibold">
          Your Payment Was Not Successful
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/">
            <button className="text-blue-600 cursor-pointer border border-blue-600 px-5 py-2 rounded-lg bg-white">
              Shop
            </button>
          </Link>
          {checkout?.url && (
            <Link href={checkout.url}>
              <button className="bg-blue-600 cursor-pointer border px-5 py-2 rounded-lg text-white">
                Retry
              </button>
            </Link>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
