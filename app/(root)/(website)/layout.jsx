import Footer from "@/components/Aplication/website/Footer";
import Header from "@/components/Aplication/website/Header";
import React from "react";

const layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
