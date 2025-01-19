import React from "react";
import RootLayout from "./Pages/RootLayout";
import Test from "./Pages/Test";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import SignIn from "./Pages/Authentication/SignIn";
import Signup from "./Pages/Authentication/Signup";
import VerifyEmail from "./Pages/Authentication/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "test",
        element: <Test />,
      },
    ],
  },
  {
    path: "authentication/signin",
    element: <SignIn />,
  },
  {
    path: "authentication/signup",
    element: <Signup />,
  },
  {
    path: "authentication/verifyEmail",
    element: <VerifyEmail />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
