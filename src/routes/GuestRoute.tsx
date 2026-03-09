import React from "react";
import { Navigate } from "react-router-dom";
import { tokenStorage } from "../services/auth/tokenStorage";

interface GuestRouteProps {
  children: React.ReactNode;
}

// Гостьовий маршрут — редирект на / якщо вже авторизований
const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  if (tokenStorage.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default GuestRoute;
