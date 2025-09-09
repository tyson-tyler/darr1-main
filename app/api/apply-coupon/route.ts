import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // 👈 make sure you have your Firestore db export here
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const couponRef = doc(db, "coupons", code.toUpperCase().trim());
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) {
      return NextResponse.json(
        { message: "Invalid coupon code" },
        { status: 404 }
      );
    }

    const couponData = couponSnap.data();

    // ✅ Check expiry (works for Firestore Timestamp or string/Date)
    if (couponData.expiresAt) {
      let expiresAtMillis: number;

      if (couponData.expiresAt instanceof Timestamp) {
        expiresAtMillis = couponData.expiresAt.toMillis();
      } else {
        expiresAtMillis = new Date(couponData.expiresAt).getTime();
      }

      if (expiresAtMillis < Date.now()) {
        return NextResponse.json(
          { message: "Coupon has expired" },
          { status: 400 }
        );
      }
    }

    // ✅ Check max usage
    if (
      couponData.maxUses &&
      (couponData.usedCount || 0) >= couponData.maxUses
    ) {
      return NextResponse.json(
        { message: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    // ✅ Increment used count safely
    try {
      await updateDoc(couponRef, {
        usedCount: (couponData.usedCount || 0) + 1,
      });
    } catch (err) {
      console.error("Failed to update coupon usage:", err);
      return NextResponse.json(
        { message: "Failed to update coupon" },
        { status: 500 }
      );
    }

    // ✅ Return discount details
    return NextResponse.json({
      discountType: couponData.discountType,
      discountValue: couponData.discountValue,
    });
  } catch (err) {
    console.error("Apply coupon error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
