import React from "react";
import RootLayout from "./Pages/RootLayout";
import Test from "./Pages/Test";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import AdminMain from "./Pages/Layout/AccountManagement/AdminMain";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "admin",
        element: <AdminMain />,
      },
      {
        path: "test",
        element: <Test />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
