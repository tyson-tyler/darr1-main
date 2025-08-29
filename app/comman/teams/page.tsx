"use client";
import React from "react";

const LicensePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Product License & Terms</h1>
          <p className="text-gray-500 mt-2">
            Please read these terms carefully before purchasing or using our products.
          </p>
        </div>

        {/* License Content */}
        <div className="prose max-w-none text-gray-700">
          <h2>1. Grant of Use</h2>
          <p>
            By purchasing our T-shirts, you are granted a personal, non-transferable
            right to use and wear the products for personal purposes. 
            Commercial resale or redistribution without permission is not allowed.
          </p>

          <h2>2. Restrictions</h2>
          <ul className="list-disc pl-6">
            <li>Products are for personal use only unless explicitly agreed upon.</li>
            <li>Reselling or rebranding our products without consent is prohibited.</li>
            <li>Any unauthorized commercial use of our designs is strictly forbidden.</li>
          </ul>

          <h2>3. Returns & Exchanges</h2>
          <p>
            We accept returns or exchanges within <strong>7 days</strong> of delivery,
            provided the product is unused, unwashed, and in original packaging.
            Customized or personalized T-shirts are non-returnable.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All product designs, logos, and branding are the intellectual property of{" "}
            <strong>The Drott</strong>. Copying or reproducing designs without permission
            is not permitted.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            Our products are provided “as is.” We are not liable for damages caused by
            misuse, improper washing, or unauthorized alterations of the products.
          </p>

          <h2>6. Termination</h2>
          <p>
            Violation of these terms may result in cancellation of your order(s) or
            restrictions on future purchases from our store.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center border-t pt-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} The Drott. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LicensePage;
