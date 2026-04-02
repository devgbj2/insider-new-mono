import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { Loading } from "./lib/common";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export const AdminProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
};