import { admin, adminDB } from "@/lib/firebase_admin";
import { NextRequest, NextResponse } from "next/server";

// Utility: recursively remove undefined fields
const removeUndefinedFields = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(removeUndefinedFields);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefinedFields(v)])
    );
  }
  return obj;
};

export async function POST(req: NextRequest) {
  let checkout_id: string | undefined;

  // Parse JSON safely
  try {
    const body = await req.json();
    checkout_id = body?.checkout_id;
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!checkout_id) {
    return NextResponse.json({ error: "Missing checkout ID" }, { status: 400 });
  }

  try {
    const list = await adminDB
      .collectionGroup("checkout_sessions_cod")
      .where("id", "==", checkout_id)
      .get();

    if (list.empty) {
      return NextResponse.json(
        { error: "Invalid Checkout ID" },
        { status: 404 }
      );
    }

    const checkout = list.docs[0].data();
    const orderRef = adminDB.doc(`orders/${checkout.id}`);
    const order = await orderRef.get();

    if (order.exists) {
      return NextResponse.json({
        success: true,
        message: "Order already exists",
      });
    }

    const uid = checkout?.metadata?.uid;
    const cleanedCheckout = removeUndefinedFields(checkout);

    await orderRef.set({
      checkout: cleanedCheckout,
      payment: {
        amount: checkout.line_items.reduce(
          (total: number, item: any) =>
            total + item.price_data.unit_amount * item.quantity,
          0
        ),
      },
      uid,
      id: checkout.id,
      paymentMode: "cod",
      timestampCreate: admin.firestore.Timestamp.now(),
    });

    const productList = checkout.line_items.map((item: any) => ({
      productId: item.price_data.product_data.metadata.productId,
      quantity: item.quantity,
    }));

    const userRef = adminDB.doc(`users/${uid}`);
    const user = await userRef.get();
    const userData = user.data() ?? {};

    const updatedCart = (userData.carts ?? []).filter(
      (item: any) => !productList.some((p: any) => p.productId === item.id)
    );

    await userRef.set({ carts: updatedCart }, { merge: true });

    const batch = adminDB.batch();
    productList.forEach((item: any) => {
      const productRef = adminDB.doc(`products/${item.productId}`);
      batch.update(productRef, {
        orders: admin.firestore.FieldValue.increment(item.quantity),
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
