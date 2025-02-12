



import AdminMain from "./Pages/Layout/AccountManagement/AdminMain";

import React from 'react';
import RootLayout from './Pages/RootLayout';
import Test from './Pages/Test';


import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/Authentication/SignIn';
import Signup from './Pages/Authentication/Signup';
import VerifyEmail from './Pages/Authentication/VerifyEmail';
import { GoogleOAuthProvider } from '@react-oauth/google';
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'home',
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
  {
    path: 'authentication/signin',
    element: <SignIn />,
  },
  {
    path: 'authentication/signup',
    element: <Signup />,
  },
  {
    path: "authentication/verify-email",
    element: <VerifyEmail />,
  },
]);

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID_GOOGLE as string}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;
