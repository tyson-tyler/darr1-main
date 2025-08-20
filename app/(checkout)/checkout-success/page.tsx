import Footer from "../../components/footer/footer";
import TopHeader from "../../components/navbar/topheader";
import { admin, adminDB } from "@/lib/firebase_admin";
import Link from "next/link";
import SuccessMessage from "./components/SuccessMessage";
import { Metadata } from "next";
import Productnav from "@/app/components/navbar/ProductNav";

// Types
type CheckoutSession = {
  id: string;
  line_items?: {
    quantity: number;
    price_data: {
      product_data: {
        metadata: {
          productId: string;
        };
      };
    };
  }[];
  [key: string]: any;
};

type Payment = {
  id: string;
  metadata: {
    uid: string;
    checkoutId: string;
  };
  [key: string]: any;
};

type SearchParams = {
  checkout_id: string;
};

export const metadata: Metadata = {
  title: "Order Success",
};

const fetchCheckout = async (
  checkoutId: string
): Promise<CheckoutSession | null> => {
  try {
    const list = await adminDB
      .collectionGroup("checkout_sessions")
      .where("id", "==", checkoutId)
      .get();

    if (list.docs.length === 0) {
      throw new Error("Invalid Checkout ID");
    }

    return list.docs[0].data() as CheckoutSession;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

const fetchPayment = async (checkoutId: string): Promise<Payment | null> => {
  try {
    const list = await adminDB
      .collectionGroup("payments")
      .where("metadata.checkoutId", "==", checkoutId)
      .where("status", "==", "succeeded")
      .get();

    if (list.docs.length === 0) {
      throw new Error("Invalid Checkout ID");
    }

    return list.docs[0].data() as Payment;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

const processOrder = async ({
  payment,
  checkout,
}: {
  payment: Payment | null;
  checkout: CheckoutSession | null;
}): Promise<boolean> => {
  if (!payment || !checkout) return false;

  const order = await adminDB.doc(`orders/${payment.id}`).get();
  if (order.exists) return false;

  const uid = payment.metadata.uid;

  await adminDB.doc(`orders/${payment.id}`).set({
    checkout,
    payment,
    uid,
    id: payment.id,
    paymentMode: "prepaid",
    timestampCreate: admin.firestore.Timestamp.now(),
  });

  const productList =
    checkout.line_items?.map((item) => ({
      productId: item.price_data.product_data.metadata.productId,
      quantity: item.quantity,
    })) ?? [];

  const userDoc = await adminDB.doc(`users/${uid}`).get();
  const userData = userDoc.data();

  const productIdsList = productList.map((item) => item.productId);
  const newCartList = (userData?.carts ?? []).filter(
    (cartItem: { id: string }) => !productIdsList.includes(cartItem.id)
  );

  await adminDB
    .doc(`users/${uid}`)
    .set({ carts: newCartList }, { merge: true });

  const batch = adminDB.batch();
  productList.forEach((item) => {
    batch.update(adminDB.doc(`products/${item.productId}`), {
      orders: admin.firestore.FieldValue.increment(item.quantity),
    });
  });

  await batch.commit();
  return true;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { checkout_id } = searchParams;

  const checkout = await fetchCheckout(checkout_id);
  const payment = await fetchPayment(checkout_id);
  const result = await processOrder({ checkout, payment });

  return (
    <main>
      <Productnav />
      <SuccessMessage />
      <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
        <div className="flex justify-center w-full">
          <img src="/success.svg" className="h-48" alt="" />
        </div>
        <h1 className="text-2xl font-semibold text-green">
          Your Order Is{" "}
          <span className="font-bold text-green-600">Successfully</span> Placed
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href={"/account"}>
            <button className="text-blue-600 border border-blue-600 px-5 py-2 rounded-lg bg-white">
              Go To Orders Page
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
