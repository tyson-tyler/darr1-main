"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

type Address = {
  fullName: string;
  mobile: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  orderNote?: string;
  size?: string;
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function CheckoutForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    fullName: "",
    mobile: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    state: "",
    orderNote: "",
    size: "",
  });

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const requiredFields: (keyof Address)[] = [
      "fullName",
      "mobile",
      "email",
      "addressLine1",
      "pincode",
      "city",
      "state",
    ];
    for (const field of requiredFields) {
      if (!address[field]) return false;
    }
    return true;
  };

  return (
    <div className="w-full flex justify-center items-center bg-gray-50 py-10 px-4">
      {currentStep === 1 && (
        <motion.div
          key="step1"
          className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl flex flex-col gap-4"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h1 className="text-xl font-bold text-gray-800 text-center">
            Step 1: Shipping Address
          </h1>

          {/* Address Inputs */}
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

            {/* Notes */}
            <textarea
              placeholder="Notes about your order"
              value={address.orderNote ?? ""}
              onChange={(e) =>
                handleAddressChange("orderNote", e.target.value)
              }
              className="border border-gray-300 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* SIZE SELECTION */}
            <h2 className="text-sm font-semibold text-gray-700 text-center mt-4">
              Select T-Shirt Size
            </h2>
            <div className="flex justify-center gap-4 mt-2">
              {["M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleAddressChange("size", size)}
                  className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all shadow-sm
                ${
                  address.size === size
                    ? "bg-black text-white border-black scale-105 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black hover:scale-105"
                }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <button
              onClick={() => {
                if (!validateAddress()) {
                  toast.error("Please fill in all required address fields.");
                  return;
                }
                if (!address.size) {
                  toast.error("Please select a T-Shirt size before continuing.");
                  return;
                }
                setCurrentStep(2);
              }}
              className="mt-6 bg-black text-white px-4 py-3 rounded-xl text-sm hover:bg-gray-800 transition-all"
            >
              Continue to Order Summary →
            </button>
          </div>
        </motion.div>
      )}

      {currentStep === 2 && (
        <motion.div
          key="step2"
          className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl flex flex-col gap-4"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h1 className="text-xl font-bold text-gray-800 text-center">
            Step 2: Order Summary
          </h1>
          <p className="text-sm text-gray-600">
            <strong>Name:</strong> {address.fullName}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Size:</strong> {address.size}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Address:</strong> {address.addressLine1}, {address.city},{" "}
            {address.state} - {address.pincode}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Notes:</strong> {address.orderNote || "None"}
          </p>

          <button
            onClick={() => toast.success("Order placed successfully!")}
            className="mt-4 bg-green-600 text-white px-4 py-3 rounded-xl text-sm hover:bg-green-700 transition-all"
          >
            Place Order ✅
          </button>
        </motion.div>
      )}
    </div>
  );
}
