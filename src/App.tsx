import React from "react";
import RootLayout from "./Pages/RootLayout";
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
import CreateEvent from "./Pages/Event/CreateEvent";
import MyProfile from "./Pages/Profile/MyProfile";
import VolunteerSuggestions from "./Pages/Volunteer/VolunteerSuggestions";
import UpdateEvent from "./Pages/Event/UpdateEvent";
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'aboutus',
        element: <AboutUs />,
      },
      {
        path: 'admin',
        element: <AdminMain />,
      },
      {
        path: "events",
        element: <ShowEvent />,
      },
      {
        path: 'detail-event/:id',
        element: <DetailEvent />,
      },
      {
        path: 'joined-events',
        element: <MyJoinedEvents />,
      },
      {
        path: 'create-event',
        element: <CreateEvent />,
      },
      {
        path: 'update-event/:id',
        element: <UpdateEvent />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "volunteer-suggestions",
        element: <VolunteerSuggestions />,
      },
      {
        path: "participate-event/:id",
        element: <VolunteerSuggestions />,
      },
    ],
  },
  {
    path: 'authentication/signin',
    element: <SignIn />,
  },
  {
    path: 'authentication/signup',
    element: <Signup />,
  },
  {
    path: 'authentication/verify-email',
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
