import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  DocumentReference,
} from "firebase/firestore";

// ---- Types ----

type Product = {
  id: string;
  quantity: number;
  product: {
    title: string;
    shortDescription?: string;
    featureImageURL?: string;
    saleprice?: number;
    salePrice?: number;
  };
};

type Address = Record<string, any>;

type CheckoutPayload = {
  uid: string;
  products: Product[];
  address: Address;
};

// ---- Card Checkout ----

export const createCheckoutAndGetURL = async ({
  uid,
  products,
  address,
}: CheckoutPayload): Promise<string> => {
  const checkoutId = doc(collection(db, `ids`)).id;
  const ref: DocumentReference = doc(
    db,
    `users/${uid}/checkout_sessions/${checkoutId}`
  );

  const line_items = products.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.product.title,
        description: item.product.shortDescription ?? "",
        images: [
          item.product.featureImageURL ??
            `https://i.ibb.co/FL0jxNDt/Whats-App-Image-2025-05-16-at-14-02-01-266c60c4.jpg`,
        ],
        metadata: {
          productId: item.id,
        },
      },
      unit_amount: (item.product.saleprice ?? 0) * 100,
    },
    quantity: item.quantity,
  }));

  await setDoc(ref, {
    id: checkoutId,
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    metadata: {
      checkoutId,
      uid,
      address: JSON.stringify(address),
    },
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-success?checkout_id=${checkoutId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-failed?checkout_id=${checkoutId}`,
  });

  // Wait for backend (e.g., Firebase Function or Stripe extension) to attach URL
  await new Promise((res) => setTimeout(res, 3000));
  let checkoutSession = await getDoc(ref);

  if (!checkoutSession.exists()) throw new Error("Checkout Session not found");

  const sessionData = checkoutSession.data();
  if (sessionData?.error?.message) throw new Error(sessionData.error.message);

  if (sessionData?.url) return sessionData.url;

  // Retry once more after delay
  await new Promise((res) => setTimeout(res, 6000));
  checkoutSession = await getDoc(ref);

  if (checkoutSession.data()?.url) {
    return checkoutSession.data()?.url;
  } else {
    throw new Error("Something went wrong retrieving the checkout URL.");
  }
};

// ---- COD Checkout ----

export const createCheckoutCODAndGetId = async ({
  uid,
  products,
  address,
}: CheckoutPayload): Promise<string> => {
  const checkoutId = `cod_${doc(collection(db, `ids`)).id}`;
  const ref = doc(db, `users/${uid}/checkout_sessions_cod/${checkoutId}`);

  const line_items = products.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.product.title ?? "",
        description: item.product.shortDescription ?? "",
        images: [
          item.product.featureImageURL ??
            `https://i.ibb.co/FL0jxNDt/Whats-App-Image-2025-05-16-at-14-02-01-266c60c4.jpg`,
        ],
        metadata: {
          productId: item.id,
        },
      },
      unit_amount: (item.product.saleprice ?? 0) * 100,
    },
    quantity: item.quantity ?? 1,
  }));

  await setDoc(ref, {
    id: checkoutId,
    line_items,
    metadata: {
      checkoutId,
      uid,
      address: JSON.stringify(address),
    },
    createdAt: Timestamp.now(),
  });

  return checkoutId;
};
