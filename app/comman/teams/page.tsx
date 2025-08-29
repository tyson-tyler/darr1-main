"use client";
import React from "react";

const LicensePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Software License</h1>
          <p className="text-gray-500 mt-2">
            Please read the license agreement carefully before using this
            application.
          </p>
        </div>

        {/* License Content */}
        <div className="prose max-w-none text-gray-700">
          <h2>1. Grant of License</h2>
          <p>
            This license grants you a limited, non-transferable right to use the
            software for personal or commercial purposes, subject to the
            conditions outlined below.
          </p>

          <h2>2. Restrictions</h2>
          <ul className="list-disc pl-6">
            <li>You may not reverse-engineer, decompile, or resell the software.</li>
            <li>You may not distribute the software without written permission.</li>
            <li>
              Modifications are allowed only for personal/internal use unless
              otherwise permitted.
            </li>
          </ul>

          <h2>3. Limitation of Liability</h2>
          <p>
            The software is provided "as is", without warranty of any kind. The
            authors are not responsible for any damages resulting from its use.
          </p>

          <h2>4. Termination</h2>
          <p>
            The license is effective until terminated. Violation of terms will
            result in immediate termination of usage rights.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center border-t pt-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LicensePage;
