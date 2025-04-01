import React from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import ScrollToTop from "../Common/ScrollToTop";

export default function RootLayout() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/admin");
  const hideFooter = location.pathname.startsWith("/admin");

  return (
    <div className="relative">
      <ScrollToTop />
      {!hideHeader && <Header />}
      <main className={hideFooter ? "" : `my-3 lg:my-8` + "container mx-auto px-4 lg:px-0 lg:w-3/4"}>
        <Outlet />
      </main>
      {!hideHeader && <Footer />}
    </div>
  );
}
