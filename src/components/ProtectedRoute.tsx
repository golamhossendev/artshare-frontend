import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/hooks";

export const ProtectedRoute = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

