import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });
    }

    // Reference to the coupon document
    const couponRef = doc(db, "coupons", code.toUpperCase().trim());
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) {
      return NextResponse.json({ message: "Invalid coupon code" }, { status: 404 });
    }

    const couponData = couponSnap.data();

    // Check expiry
    if (couponData.expiresAt && couponData.expiresAt.toMillis() < Timestamp.now().toMillis()) {
      return NextResponse.json({ message: "Coupon has expired" }, { status: 400 });
    }

    // Check max usage
    if (couponData.maxUses && couponData.usedCount >= couponData.maxUses) {
      return NextResponse.json({ message: "Coupon usage limit reached" }, { status: 400 });
    }

    // Increment used count
    await updateDoc(couponRef, { usedCount: (couponData.usedCount || 0) + 1 });

    return NextResponse.json({
      discountType: couponData.discountType, // "percentage" or "fixed"
      discountValue: couponData.discountValue, // number
    });
  } catch (err) {
    console.error("Apply coupon error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
