import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Example coupons
const coupons: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
  FIRST50: 50,
};

export const applyCouponToProduct = async (
  productId: string,
  couponCode: string
): Promise<{ success: boolean; newPrice?: number; error?: string }> => {
  try {
    const upper = couponCode.trim().toUpperCase();
    const discount = coupons[upper];

    if (!discount) {
      return { success: false, error: "Invalid coupon" };
    }

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return { success: false, error: "Product not found" };
    }

    const product = productSnap.data();
    const currentSalePrice = product?.saleprice ?? product?.price;

    const newPrice = Math.floor(currentSalePrice - (currentSalePrice * discount) / 100);

    // 🔥 update Firestore saleprice
    await updateDoc(productRef, {
      saleprice: newPrice,
      couponApplied: upper,
      couponDiscount: discount,
      timestampCouponApplied: new Date().toISOString(),
    });

    return { success: true, newPrice };
  } catch (err: any) {
    console.error("Coupon error:", err);
    return { success: false, error: err.message };
  }
};
