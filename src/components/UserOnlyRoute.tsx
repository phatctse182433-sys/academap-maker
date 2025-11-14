import { Navigate } from "react-router-dom";
import { tokenUtils } from "@/lib/api";

export const UserOnlyRoute = ({ children }: any) => {
  const token = tokenUtils.get();
  const role = token ? tokenUtils.getUserRole(token) : null;

  // Nếu là ADMIN → không cho vào user pages
  if (role === "ROLE_ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};
