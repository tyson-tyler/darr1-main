import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });
    }

    const couponRef = doc(db, "coupons", code.toUpperCase().trim());
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) {
      return NextResponse.json({ message: "Invalid coupon code" }, { status: 404 });
    }

    const couponData = couponSnap.data();

    if (!couponData.discountType || couponData.discountValue === undefined) {
      return NextResponse.json({ message: "Coupon data is corrupted" }, { status: 400 });
    }

    if (couponData.maxUses && (couponData.usedCount || 0) >= couponData.maxUses) {
      return NextResponse.json({ message: "Coupon usage limit reached" }, { status: 400 });
    }

    // Increment usage safely
    await updateDoc(couponRef, {
      usedCount: Number(couponData.usedCount || 0) + 1,
    });

    return NextResponse.json({
      discountType: couponData.discountType,
      discountValue: couponData.discountValue,
    });
  } catch (err) {
    console.error("❌ Apply coupon error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
