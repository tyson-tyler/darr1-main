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
import Link from "next/link";

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
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Address, 2: Order, 3: Payment
  const [address, setAddress] = useState<Address>({});
  const { user } = useAuth();
  const router = useRouter();

  // Coupon system
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return setCouponMessage("Enter a coupon code");
    setIsApplyingCoupon(true);
    setCouponMessage("");

    try {
      const res = await fetch("/api/applycop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCouponMessage(data.message);
        setCouponDiscount(null);
      } else {
        setCouponDiscount({ type: data.discountType, value: data.discountValue });
        setCouponMessage(
          `Coupon applied! You got a ${data.discountValue}${
            data.discountType === "percentage" ? "%" : "₹"
          } discount`
        );
      }
    } catch (err) {
      setCouponMessage("Failed to apply coupon. Try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      if (totalPrice <= 0) throw new Error("Price should be greater than 0");
      if (!validateAddress())
        throw new Error("Please fill in all required address details.");
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

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <AnimatePresence mode="wait">
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
            <div className="flex flex-col gap-3">
              {[
                { id: "fullName", placeholder: "Full Name" },
                { id: "mobile", placeholder: "Mobile Number", type: "tel" },
                { id: "email", placeholder: "Email", type: "email" },
                { id: "addressLine1", placeholder: "Address Line 1" },
                { id: "addressLine2", placeholder: "Address Line 2" },
                { id: "pincode", placeholder: "Pincode", type: "number" },
                { id: "city", placeholder: "City" },
                { id: "state", placeholder: "State" },
              ].map(({ id, placeholder, type = "text" }) => (
                <input
                  key={id}
                  type={type}
                  placeholder={placeholder}
                  value={(address as any)[id] ?? ""}
                  onChange={(e) =>
                    handleAddressChange(id as keyof Address, e.target.value)
                  }
                  className="border border-gray-300 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              ))}
              <h2 className="text-sm font-semibold text-gray-700">Select Size</h2>
              <div className="flex justify-center gap-3">
                {["M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleAddressChange("orderNote", size)}
                    className={`px-5 py-2 rounded-xl border text-sm font-medium transition-all ${
                      address.orderNote === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!validateAddress()) {
                    toast.error("Please fill in all required address fields.");
                    return;
                  }
                  setCurrentStep(2);
                }}
                className="bg-black text-white px-4 py-3 rounded-xl text-sm"
              >
                Continue to Order Summary →
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            className="bg-white p-6 rounded-2xl shadow-xl space-y-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="text-xl font-bold text-gray-800">
              Step 2: Your Order
            </h1>

            {/* Coupon Input */}
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border px-3 py-2 rounded-lg flex-grow text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {productList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50 rounded-xl p-2"
                >
                  <Image
                    src={item.product.featureImageURL}
                    alt={item.product.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-600">
                      ₹{item.product.saleprice}
                      <span className="line-through text-xs ml-1 text-gray-400">
                        ₹{item.product.price}
                      </span>{" "}
                      × {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold">
                    ₹{item.product.saleprice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <h2>Total</h2>
              <h2>₹{totalPrice.toFixed(2)}</h2>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-sm text-gray-600 underline"
              >
                ← Back to Address
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
            <div className="flex flex-col gap-2">
              {[{ label: "Cash On Delivery", value: "cod" }].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() =>
                    setPaymentMode(mode.value as "prepaid" | "cod")
                  }
                  className={`flex items-center gap-2 text-sm ${
                    paymentMode === mode.value
                      ? "text-black font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {paymentMode === mode.value ? (
                    <CheckSquare2Icon size={16} className="text-blue-500" />
                  ) : (
                    <Square size={16} />
                  )}
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 text-xs text-gray-600 items-center">
              <CheckSquare2Icon size={14} className="text-blue-500" />
              <span>
                I agree to the{" "}
                <Link
                  href={"/comman/policy"}
                  className="text-blue-700 underline cursor-pointer"
                >
                  terms & conditions
                </Link>
              </span>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-sm text-gray-600 underline"
              >
                ← Back to Order
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="bg-black text-white px-4 py-3 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
