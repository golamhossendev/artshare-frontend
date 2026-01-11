import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/hooks";

export const PublicRoute = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  // If user is already authenticated, redirect to feed
  if (user && token) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};

