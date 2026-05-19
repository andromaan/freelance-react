import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "../components/layout/Layout";

// Auth pages (гостьові — недоступні після логіну)
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Public pages (доступні всім)
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Protected pages
import Notifications from "../pages/notifications/NotificationsPage";
import WalletPage from "../pages/wallet/WalletPage";
import MyProjectsPage from "../pages/my-projects/MyProjectsPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ── Гостьові маршрути (редирект якщо авторизований) ─────────── */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* ── Маршрути з Layout ─────────────────────────────────────────── */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-projects"
          element={
            <ProtectedRoute>
              <MyProjectsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Fallback ──────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
