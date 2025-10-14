import CursorDot from "@/components/Aplication/website/CursorDot";
import Footer from "@/components/Aplication/website/Footer";
import Header from "@/components/Aplication/website/Header";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <CursorDot />   {/* <- Cursor dot globally */}
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
