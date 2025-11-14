import { Navigate } from "react-router-dom";
import { tokenUtils } from "@/lib/api";

export const AdminOnlyRoute = ({ children }: any) => {
  const token = tokenUtils.get();
  const role = token ? tokenUtils.getUserRole(token) : null;

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ROLE_ADMIN") return <Navigate to="/" replace />;

  return children;
};
