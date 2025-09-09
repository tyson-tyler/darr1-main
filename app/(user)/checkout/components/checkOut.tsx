"use client";

import { useAuth } from "@/context/authcontext";
import {
  createCheckoutAndGetURL,
  createCheckoutCODAndGetId,
} from "@/lib/firebase/checkout/write";
import confetti from "canvas-confetti";
import { CheckSquare2Icon, Square } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type Address = {
  fullName?: string;
  mobile?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  pincode?: string;
  city?: string;
  state?: string;
  orderNote?: string;
};

type Product = {
  id: string;
  quantity: number;
  product: {
    title: string;
    price: number;
    saleprice: number;
    featureImageURL: string;
  };
};

type CheckoutProps = {
  productList: Product[];
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const Checkout: React.FC<CheckoutProps> = ({ productList }) => {
  const [paymentMode, setPaymentMode] = useState<"prepaid" | "cod">("prepaid");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<Address>({});
  const { user } = useAuth();
  const router = useRouter();

  // Coupon system state
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<{
    type: "percentage" | "fixed";
    value: number;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleAddressChange = (key: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const totalPriceBeforeDiscount = productList.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.saleprice,
    0
  );

  const totalPrice = couponDiscount
    ? couponDiscount.type === "percentage"
      ? totalPriceBeforeDiscount * (1 - couponDiscount.value / 100)
      : Math.max(0, totalPriceBeforeDiscount - couponDiscount.value)
    : totalPriceBeforeDiscount;

  const validateAddress = () => {
    const requiredFields: (keyof Address)[] = [
      "fullName",
      "mobile",
      "addressLine1",
    ];
    return requiredFields.every((field) => address[field]?.trim());
  };

  // ----------------------------
  // Apply Coupon
  // ----------------------------
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return setCouponMessage("Enter a coupon code");
    setIsApplyingCoupon(true);
    setCouponMessage("");

    try {
      const res = await fetch("/api/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCouponMessage(data.message);
        setCouponDiscount(null);
      } else {
        setCouponDiscount({
          type: data.discountType,
          value: data.discountValue,
        });
        setCouponMessage(
          `Coupon applied! You got a ${data.discountValue}${
            data.discountType === "percentage" ? "%" : "₹"
          } discount`
        );
      }
    } catch (err) {
      setCouponMessage("Failed to apply coupon. Try again.");
      setCouponDiscount(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // ----------------------------
  // Place Order
  // ----------------------------
  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      if (totalPrice <= 0) throw new Error("Price should be greater than 0");
      if (!validateAddress()) throw new Error("Please fill in address details.");
      if (!productList.length) throw new Error("Your cart is empty.");
      if (!user?.uid) throw new Error("User not authenticated.");

      const orderData = {
        uid: user.uid,
        products: productList,
        address,
        coupon: couponDiscount ? { code: couponCode, ...couponDiscount } : null,
      };

      if (paymentMode === "prepaid") {
        const url = await createCheckoutAndGetURL(orderData);
        router.push(url);
      } else {
        const checkoutId = await createCheckoutCODAndGetId(orderData);
        toast.success("Order placed successfully!");
        confetti();
        router.push(`/checkout-cod?checkout_id=${checkoutId}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <AnimatePresence mode="wait">
        {/* Step 1: Shipping */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="text-xl font-bold text-gray-800">
              Step 1: Shipping Address
            </h1>
            {["fullName", "mobile", "email", "addressLine1", "addressLine2", "pincode", "city", "state"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace(/([A-Z])/g, ' $1')}
                onChange={(e) => handleAddressChange(field as keyof Address, e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm"
              />
            ))}
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-black text-white px-4 py-3 rounded-xl text-sm"
            >
              Continue to Order Summary →
            </button>
          </motion.div>
        )}

        {/* Step 2: Order Summary */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            className="bg-white p-6 rounded-2xl shadow-xl space-y-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="text-xl font-bold text-gray-800">Step 2: Your Order</h1>

            <div className="space-y-3">
              {productList.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex gap-3 items-center">
                    <Image
                      src={item.product.featureImageURL}
                      alt={item.product.title}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="font-medium text-sm">{item.product.title}</h2>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm">
                    ₹{(item.quantity * item.product.saleprice).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Coupon Input */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border px-3 py-2 rounded-lg flex-grow text-sm"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </button>
            </div>
            {couponMessage && (
              <p
                className={`text-xs ${
                  couponDiscount ? "text-green-600" : "text-red-500"
                }`}
              >
                {couponMessage}
              </p>
            )}

            <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
              <h2>Total</h2>
              <h2>₹{totalPrice.toFixed(2)}</h2>
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-sm text-gray-600 underline"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-black text-white px-4 py-3 rounded-xl text-sm"
              >
                Continue to Payment →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment Mode */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Step 3: Payment Mode
            </h2>
            <button
              onClick={() => setPaymentMode("cod")}
              className={`flex items-center gap-2 text-sm ${
                paymentMode === "cod" ? "text-black font-medium" : "text-gray-600"
              }`}
            >
              {paymentMode === "cod" ? (
                <CheckSquare2Icon size={16} className="text-blue-500" />
              ) : (
                <Square size={16} />
              )}
              Cash On Delivery
            </button>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-sm text-gray-600 underline"
              >
                ← Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="bg-black text-white px-4 py-3 rounded-xl text-sm disabled:opacity-60"
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Checkout;
