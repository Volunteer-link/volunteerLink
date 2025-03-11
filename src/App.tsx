import React from "react";
import RootLayout from "./Pages/RootLayout";
import Test from "./Pages/Test";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import SignIn from "./Pages/Authentication/SignIn";
import Signup from "./Pages/Authentication/Signup";
import VerifyEmail from "./Pages/Authentication/VerifyEmail";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminMain from "./Pages/AccountManagement/AdminMain";
import AboutUs from "./Pages/AboutUs";
import ShowEvent from "./Pages/ShowEvents/ShowEvents";
import DetailEvent from "./Pages/ShowEvents/DetailEvent";
import ScrollToTop from "./Common/ScrollToTop";
import MyJoinedEvents from "./Pages/Volunteer/MyJoinedEvents";
import MyProfile from "./Pages/Profile/MyProfile";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "aboutus",
        element: <AboutUs />,
      },
      {
        path: "admin",
        element: <AdminMain />,
      },
      {
        path: "test",
        element: <Test />,
      },
      {
        path: "events",
        element: <ShowEvent />,
      },
      {
        path: "detail-event/:id",
        element: <DetailEvent />,
      },
      {
        path: "joined-events",
        element: <MyJoinedEvents />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
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
    path: "authentication/verify-email",
    element: <VerifyEmail />,
  },
]);

function App() {
  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_CLIENT_ID_GOOGLE as string}
    >
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;
