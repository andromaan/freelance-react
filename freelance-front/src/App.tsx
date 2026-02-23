import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import { tokenStorage } from "./services/auth/tokenStorage";
import { useGetMyselfQuery } from "./services/user/userApi";
import { useNotificationHub } from "./hooks/useNotificationHub";
import "./App.css";

// Робить один запит при старті та підключає SignalR
const UserLoader: React.FC = () => {
  const isAuth = tokenStorage.isAuthenticated();
  useGetMyselfQuery(undefined, { skip: !isAuth });
  useNotificationHub(isAuth);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <UserLoader />
      <AppRoutes />
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
    </BrowserRouter>
  );
}

export default App;
