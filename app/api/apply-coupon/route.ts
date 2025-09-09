import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // 👈 make sure your Firestore db is exported here
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
    console.log("✅ Coupon Data:", couponData);

    // ----------------------------
    // Check expiry
    // ----------------------------
    if (couponData.expiresAt) {
      try {
        console.log("⏳ Raw expiresAt:", couponData.expiresAt);

        let expiresAtMillis: number;

        // Firestore Timestamp has a toMillis() function
        if (typeof couponData.expiresAt.toMillis === "function") {
          expiresAtMillis = couponData.expiresAt.toMillis();
        } else {
          // If it's a plain string/Date
          expiresAtMillis = new Date(couponData.expiresAt).getTime();
        }

        console.log("📅 expiresAtMillis:", expiresAtMillis, "Now:", Date.now());

        if (expiresAtMillis < Date.now()) {
          return NextResponse.json(
            { message: "Coupon has expired" },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error("❌ Error parsing expiresAt:", err);
        return NextResponse.json(
          { message: "Invalid expiresAt value" },
          { status: 500 }
        );
      }
    }

    // ----------------------------
    // Check max usage
    // ----------------------------
    if (
      couponData.maxUses &&
      (couponData.usedCount || 0) >= couponData.maxUses
    ) {
      return NextResponse.json(
        { message: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    // ----------------------------
    // Increment used count
    // ----------------------------
    try {
      await updateDoc(couponRef, {
        usedCount: (couponData.usedCount || 0) + 1,
      });
      console.log("✅ Coupon usage incremented");
    } catch (err) {
      console.error("❌ Failed to update coupon usage:", err);
      return NextResponse.json(
        { message: "Failed to update coupon" },
        { status: 500 }
      );
    }

    // ----------------------------
    // Return discount details
    // ----------------------------
    return NextResponse.json({
      discountType: couponData.discountType,
      discountValue: couponData.discountValue,
    });
  } catch (err) {
    console.error("❌ Apply coupon error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
