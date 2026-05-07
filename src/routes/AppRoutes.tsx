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

      {/* ── Публічні маршрути з Layout ────────────────────────────────── */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      {/* ── Захищені маршрути (потрібна авторизація) ─────────────────── */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Layout>
              <WalletPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ── Fallback ──────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
