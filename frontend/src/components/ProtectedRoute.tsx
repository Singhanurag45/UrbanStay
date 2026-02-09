import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

const ProtectedRoute = ({
  children,
  role,
}: {
  children: ReactNode;
  role?: "user" | "admin";
}) => {
  const { isLoggedIn, isLoading, user } = useAuth();

  if (isLoading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
