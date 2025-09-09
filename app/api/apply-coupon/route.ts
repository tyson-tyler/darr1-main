import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // make sure you export Firestore from here
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });
    }

    const couponRef = doc(db, "coupons", code.toUpperCase().trim());
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) {
      return NextResponse.json({ message: "Invalid coupon code" }, { status: 404 });
    }

    const couponData = couponSnap.data();

    // ----------------------------
    // Max usage check
    // ----------------------------
    if (couponData.maxUses && (couponData.usedCount || 0) >= couponData.maxUses) {
      return NextResponse.json({ message: "Coupon usage limit reached" }, { status: 400 });
    }

    // ----------------------------
    // Increment usage
    // ----------------------------
    await updateDoc(couponRef, {
      usedCount: (couponData.usedCount || 0) + 1,
    });

    // ----------------------------
    // Return discount
    // ----------------------------
    return NextResponse.json({
      discountType: couponData.discountType, // "percentage" | "fixed"
      discountValue: couponData.discountValue,
    });
  } catch (err) {
    console.error("❌ Apply coupon error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
