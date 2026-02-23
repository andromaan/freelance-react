import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import { tokenStorage } from "./services/auth/tokenStorage";
import { useGetMyselfQuery } from "./services/user/userApi";
import "./App.css";

// Робить один запит при старті — заповнює Redux slice даними користувача
const UserLoader: React.FC = () => {
  useGetMyselfQuery(undefined, { skip: !tokenStorage.isAuthenticated() });
  return null;
};

// Protected Route Component — для майбутніх захищених маршрутів
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (!tokenStorage.isAuthenticated()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <UserLoader />
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
