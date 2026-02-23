import React from "react";
import { Navigate } from "react-router-dom";
import { tokenStorage } from "../services/auth/tokenStorage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Захищений маршрут — редирект на /login якщо не авторизований
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!tokenStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
