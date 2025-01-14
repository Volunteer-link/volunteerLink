import React from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function RootLayout() {
  const location = useLocation();
  return (
    <>
      Header
      <main>
        <Outlet />
      </main>
      Footer
    </>
  );
}
