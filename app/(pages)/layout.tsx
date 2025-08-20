import React from "react";
import Footer from "../components/footer/footer";
import Productnav from "../components/navbar/ProductNav";

export default function Layout({ children }: any) {
  return (
    <main>
      <div className="pb-[100px]">
        <Productnav />
      </div>
      {children}
      <div className="mt-[100px]">
        <Footer />
      </div>
    </main>
  );
}
