import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { Home } from "./pages/Home";
import { Feed } from "./pages/Feed";
import { Profile } from "./pages/Profile";
import { Explore } from "./pages/Explore";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { InsightsStatus } from "./pages/InsightsStatus";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/feed",
            element: <Feed />,
          },
          {
            path: "/explore",
            element: <Explore />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/insights",
            element: <InsightsStatus />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

