import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../ScrollToTop";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-main">
      <Navbar />
      <main className="flex-1">
        <Outlet />
        <ScrollToTop />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
