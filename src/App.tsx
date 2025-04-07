import React, { createContext, useEffect } from "react";
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
import VolunteerProfile from "./Pages/Profile/VolunteerProfile";
import OrganizationsDetail from "./Pages/Organizations/OrganizationsDetail";
import EventParticipated from "./Pages/Event/EventParticipated";
import Organizations from "./Pages/Organizations";
import ParticipationRequest from "./Pages/ParticipationRequest/ParticipationRequest";
import useWebSocket from "./Hook/useWebSocket";
import { WebsocketProvider } from "./ultils/WebsocketContext";
import NotificationPage from "./Pages/Notification/NotificationPage";
import OrganizationEvents from "./Pages/Organizations/OrganizationEvents";
import OrganizationProfile from "./Pages/Profile/OrganizationProfile";
import Profile from "./Pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./redux/store";
import { decodedCookie, getCookie } from "./ultils/cookie";
import { setUser } from "./redux/slice";
import MyInvitation from "./Pages/Profile/MyInvitation";
import ListSentRequest from "./Pages/Organizations/ListSentRequest";
import RatingManagement from "./Pages/Volunteer/RatingManagement";
import AttendanceUI from "./Pages/Attendance";
import Unauthorized from "./Pages/ErrorPages/Unauthorized";
import Forbidden from "./Pages/ErrorPages/Forbidden";
import ServerError from "./Pages/ErrorPages/ServerError";
import Bill from "./Pages/Bill/Bill";
import HistoryOrganization from "./Pages/History/HistoryOrganization";
import HistoryVolunteer from "./Pages/History/HistoryVolunteer";
import NotFound from "./Pages/ErrorPages/NotFound";

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
        path: "organizations",
        element: <Organizations />,
      },
      {
        path: "organizations/profile/:id",
        element: <OrganizationsDetail />,
      },
      {
        path: "organizations/edit-profile",
        element: <OrganizationProfile />,
      },
      {
        path: "organizations/events",
        element: <OrganizationEvents />,
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
        path: "create-event",
        element: <CreateEvent />,
      },
      {
        path: "update-event/:id",
        element: <UpdateEvent />,
      },
      {
        path: "volunteerProfile",
        element: <MyProfile />,
      },
      {
        path: "my-profile",
        element: <Profile />,
      },
      {
        path: "volunteerProfile/:id",
        element: <VolunteerProfile />,
      },
      {
        path: "volunteer-suggestions",
        element: <VolunteerSuggestions />,
      },
      {
        path: "participate-event/:id",
        element: <EventParticipated />,
      },
      {
        path: "/event/attendance/:id",
        element: <AttendanceUI />,
      },
      {
        path: "detail-event/:id/participation-request",
        element: <ParticipationRequest />,
      },
      {
        path: "detail-event/:id/volunteer-suggestion",
        element: <VolunteerSuggestions />,
      },
      {
        path: "notification",
        element: <NotificationPage />,
      },
      {
        path: "/my-invitation",
        element: <MyInvitation />,
      },
      {
        path: "detail-event/:id/sent-invitation",
        element: <ListSentRequest />,
      },
      {
        path: "/rating-management",
        element: <RatingManagement />,
      },
      {
        path: "/donation-result",
        element: <Bill />,
      },
      {
        path: "/transaction-tracking/organization",
        element: <HistoryOrganization />,
      },
      {
        path: "/transaction-tracking/volunteer",
        element: <HistoryVolunteer />,
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
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/not-found",
    element: <NotFound />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "/server-error",
    element: <ServerError />,
  },
]);

function App() {
  const dispatch = useDispatch<typeof store.dispatch>();

  const currentUser = decodedCookie(getCookie("accessToken")!);

  if (currentUser) {
    dispatch(setUser(currentUser));
  }
  return (
    <WebsocketProvider>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_CLIENT_ID_GOOGLE as string}
      >
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </WebsocketProvider>
  );
}

export default App;
