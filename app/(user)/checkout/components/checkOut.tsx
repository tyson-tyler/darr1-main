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
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Address, 2: Order, 3: Payment
  const [address, setAddress] = useState<Address>({});
  const { user } = useAuth();
  const router = useRouter();

  const handleAddressChange = (key: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const totalPrice = productList.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.saleprice,
    0
  );

  const validateAddress = () => {
    const requiredFields: (keyof Address)[] = [
      "fullName",
      "mobile",
      "addressLine1",
    ];
    return requiredFields.every((field) => address[field]?.trim());
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      if (totalPrice <= 0) throw new Error("Price should be greater than 0");
      if (!validateAddress())
        throw new Error("Please fill in all required address details.");
      if (!productList.length) throw new Error("Your cart is empty.");
      if (!user?.uid) throw new Error("User not authenticated.");

      if (paymentMode === "prepaid") {
        const url = await createCheckoutAndGetURL({
          uid: user.uid,
          products: productList,
          address,
        });
        router.push(url);
      } else {
        const checkoutId = await createCheckoutCODAndGetId({
          uid: user.uid,
          products: productList,
          address,
        });
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
              <textarea
                placeholder="Notes about your order"
                value={address.orderNote ?? ""}
                onChange={(e) =>
                  handleAddressChange("orderNote", e.target.value)
                }
                className="border border-gray-300 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
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
              <h2>₹{totalPrice}</h2>
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
              {[
                { label: "Prepaid", value: "prepaid" },
                { label: "Cash On Delivery", value: "cod" },
              ].map((mode) => (
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
                <span className="text-blue-700 underline cursor-pointer">
                  terms & conditions
                </span>
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
