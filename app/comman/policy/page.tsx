"use client";
import React from "react";
import { FaTshirt, FaShieldAlt, FaUndoAlt, FaGavel } from "react-icons/fa";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 space-y-10">
        {/* Header */}
        <div className="text-center">
          <FaTshirt className="text-green-600 mx-auto mb-4" size={50} />
          <h1 className="text-4xl font-bold text-gray-800">Terms & Conditions</h1>
          <p className="text-gray-500 mt-3">
            Welcome to <span className="font-semibold text-green-600">The Drott</span>.  
            By purchasing or using our products, you agree to the following terms.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* License of Use */}
          <section className="bg-gray-50 border-l-4 border-green-500 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <FaShieldAlt className="text-green-600" size={22} />
              <h2 className="text-2xl font-semibold">1. Use of Products</h2>
            </div>
            <p>
              Our T-shirts are sold for <strong>personal use only</strong>.  
              Commercial resale, redistribution, or reproduction of designs 
              without written permission is prohibited.
            </p>
          </section>

          {/* Returns & Exchanges */}
          <section className="bg-gray-50 border-l-4 border-blue-500 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <FaUndoAlt className="text-blue-600" size={22} />
              <h2 className="text-2xl font-semibold">2. Returns & Exchanges</h2>
            </div>
            <p>
              Returns and exchanges are accepted within <strong>7 days</strong> 
              of delivery if the product is unworn, unwashed, and in its original packaging.  
              Customized or personalized T-shirts are <strong>non-returnable</strong>.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-gray-50 border-l-4 border-purple-500 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <FaGavel className="text-purple-600" size={22} />
              <h2 className="text-2xl font-semibold">3. Intellectual Property</h2>
            </div>
            <p>
              All designs, logos, and branding are the intellectual property of{" "}
              <strong>The Drott</strong>. Any unauthorized use of our designs or 
              reproductions is strictly prohibited.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-gray-50 border-l-4 border-red-500 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <FaShieldAlt className="text-red-600" size={22} />
              <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
            </div>
            <p>
              Our products are provided “as is.” We are not responsible for damages 
              caused by misuse, improper washing, or alterations of the products 
              after purchase.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} The Drott. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
