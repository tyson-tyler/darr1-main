export async function POST(req: NextRequest) {
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

    // Check expiry
    if (couponData.expiresAt) {
      const expiresAtMillis = couponData.expiresAt.toMillis
        ? couponData.expiresAt.toMillis()
        : new Date(couponData.expiresAt).getTime();

      if (expiresAtMillis < Timestamp.now().toMillis()) {
        return NextResponse.json({ message: "Coupon has expired" }, { status: 400 });
      }
    }

    // Check max usage
    if (couponData.maxUses && (couponData.usedCount || 0) >= couponData.maxUses) {
      return NextResponse.json({ message: "Coupon usage limit reached" }, { status: 400 });
    }

    // Increment used count safely
    try {
      await updateDoc(couponRef, { usedCount: (couponData.usedCount || 0) + 1 });
    } catch (err) {
      console.error("Failed to update coupon usage:", err);
      return NextResponse.json({ message: "Failed to update coupon" }, { status: 500 });
    }

    return NextResponse.json({
      discountType: couponData.discountType,
      discountValue: couponData.discountValue,
    });

  } catch (err) {
    console.error("Apply coupon error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
