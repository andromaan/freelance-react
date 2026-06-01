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
import MyProjectPage from "../pages/my-project/MyProjectPage";
import MyProjectBidsPage from "../pages/my-project/MyProjectBidsPage";
import MyProjectQuotesPage from "../pages/my-project/MyProjectQuotesPage";
import ProjectsPage from "../pages/projects/ProjectsPage";
import FreelancersPage from "../pages/freelancers/FreelancersPage";
import ProjectPage from "../pages/project/ProjectPage";
import ProjectBidsPage from "../pages/project/ProjectBidsPage";
import MyProfilePage from "../pages/profile/MyProfilePage";
import MyContractsPage from "../pages/contracts/MyContractsPage";
import FreelancerProfilePage from "../pages/freelancer/FreelancerProfilePage";
import EmployerProfilePage from "../pages/employer/EmployerProfilePage";
import ContractPage from "../pages/contracts/ContractPage";
import ContractChatPage from "../pages/chat/ContractChatPage";

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
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/employers/:userId" element={<EmployerProfilePage />} />
        <Route
          path="/profile/:tab"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-contracts"
          element={
            <ProtectedRoute>
              <MyContractsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-contracts/:tab"
          element={
            <ProtectedRoute>
              <MyContractsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contract/:contractId"
          element={
            <ProtectedRoute>
              <ContractPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contract/:contractId/chat"
          element={
            <ProtectedRoute>
              <ContractChatPage />
            </ProtectedRoute>
          }
        />

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

        <Route path="/my-projects">
          <Route
            index
            element={
              <ProtectedRoute>
                <MyProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path=":projectId"
            element={
              <ProtectedRoute>
                <MyProjectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path=":projectId/bids"
            element={
              <ProtectedRoute>
                <MyProjectBidsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path=":projectId/quotes"
            element={
              <ProtectedRoute>
                <MyProjectQuotesPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="projects">
          <Route index element={<ProjectsPage />} />
          <Route path=":projectId" element={<ProjectPage />} />
          <Route path=":projectId/bids" element={<ProjectBidsPage />} />
        </Route>

        <Route path="freelancers">
          <Route index element={<FreelancersPage />} />
          <Route
            path="/freelancers/:userId"
            element={<FreelancerProfilePage />}
          />
        </Route>
      </Route>

      {/* ── Fallback ──────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
