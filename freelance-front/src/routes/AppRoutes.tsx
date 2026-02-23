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
// ProtectedRoute використовується для захищених маршрутів (розкоментуйте приклад нижче)
// import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

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
      {/* Приклад:
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      */}

      {/* ── Fallback ──────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
