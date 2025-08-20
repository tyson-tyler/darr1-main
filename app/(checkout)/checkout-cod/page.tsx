import Productnav from "@/app/components/navbar/ProductNav";
import Footer from "../../../app/components/footer/footer";
import { admin, adminDB } from "@/lib/firebase_admin";
import Link from "next/link";

// Utility: recursively remove undefined fields for Firestore
const removeUndefinedFields = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedFields);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefinedFields(v)])
    );
  }
  return obj;
};

type CheckoutType = {
  id: string;
  line_items: Array<{
    quantity: number;
    price_data: {
      unit_amount: number;
      product_data: {
        metadata: { productId: string };
      };
    };
  }>;
  metadata: {
    uid: string;
  };
};

const fetchCheckout = async (checkoutId: string): Promise<CheckoutType> => {
  const list = await adminDB
    .collectionGroup("checkout_sessions_cod")
    .where("id", "==", checkoutId)
    .get();

  if (list.empty) {
    throw new Error("Invalid Checkout ID");
  }

  return list.docs[0].data() as CheckoutType;
};

const processOrder = async ({ checkout }: { checkout: CheckoutType }) => {
  const orderRef = adminDB.doc(`orders/${checkout.id}`);
  const order = await orderRef.get();

  if (order.exists) {
    return false;
  }

  const uid = checkout?.metadata?.uid;
  const cleanedCheckout = removeUndefinedFields(checkout);

  await orderRef.set({
    checkout: cleanedCheckout,
    payment: {
      amount: checkout.line_items.reduce(
        (total, item) => total + item.price_data.unit_amount * item.quantity,
        0
      ),
    },
    uid,
    id: checkout.id,
    paymentMode: "cod",
    timestampCreate: admin.firestore.Timestamp.now(),
  });

  const productList = checkout.line_items.map((item) => ({
    productId: item.price_data.product_data.metadata.productId,
    quantity: item.quantity,
  }));

  const userRef = adminDB.doc(`users/${uid}`);
  const user = await userRef.get();
  const userData = user.data() ?? {};

  const updatedCart = (userData.carts ?? []).filter(
    (item: any) => !productList.some((p) => p.productId === item.id)
  );

  await userRef.set({ carts: updatedCart }, { merge: true });

  const batch = adminDB.batch();
  productList.forEach((item) => {
    const productRef = adminDB.doc(`products/${item.productId}`);
    batch.update(productRef, {
      orders: admin.firestore.FieldValue.increment(item.quantity),
    });
  });

  await batch.commit();
  return true;
};

export default async function Page({
  searchParams,
}: {
  searchParams: { checkout_id?: string };
}) {
  const { checkout_id } = searchParams;

  if (!checkout_id) {
    return (
      <main>
        <Productnav />
        <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
          <h1 className="text-2xl font-semibold text-red-500">
            Missing checkout ID
          </h1>
          <Link href="/">
            <button className="text-blue-600 border border-blue-600 px-5 py-2 rounded-lg bg-white">
              Go to Home
            </button>
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  try {
    const checkout = await fetchCheckout(checkout_id);
    await processOrder({ checkout });

    return (
      <main>
        <Productnav />
        <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
          <div className="flex justify-center w-full">
            <img src="/success.svg" className="h-48" alt="Success" />
          </div>
          <h1 className="text-2xl font-semibold text-green-600">
            Your Order Is <span className="font-bold">Successfully</span> Placed
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/account">
              <button className="text-blue-600 border border-blue-600 px-5 py-2 rounded-lg bg-white">
                Go To Orders Page
              </button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  } catch (err) {
    console.error("Checkout processing failed:", err);

    return (
      <main>
        <Productnav />
        <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
          <h1 className="text-2xl font-semibold text-red-500">
            Something went wrong while placing your order.
          </h1>
          <Link href="/support">
            <button className="text-blue-600 border border-blue-600 px-5 py-2 rounded-lg bg-white">
              Contact Support
            </button>
          </Link>
        </section>
        <Footer />
      </main>
    );
  }
}
