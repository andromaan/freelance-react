import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import { tokenStorage } from "./services/auth/tokenStorage";
import { useGetMyselfQuery } from "./services/user/userApi";
import { useNotificationHub } from "./hooks/useNotificationHub";
import "./App.css";
import { useGetAllNotReadQuery } from "./services/notification/notificationApi";
import type { AppDispatch } from "./store";
import { useDispatch } from "react-redux";
import { addNotifications } from "./store/notificationSlice";

// Makes one request at startup and connects SignalR
const UserLoader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isAuth = tokenStorage.isAuthenticated();
  useGetMyselfQuery(undefined, { skip: !isAuth });

  useNotificationHub(isAuth);
  const { data: paginatedNotifications = [] } = useGetAllNotReadQuery(
    undefined,
    { skip: !isAuth },
  );

  useEffect(() => {
    dispatch(addNotifications(paginatedNotifications));
  }, [paginatedNotifications, dispatch]);

  return null;
};

function App() {
  // Remove the HTML-level full-page loader once React has mounted
  React.useEffect(() => {
    const loader = document.getElementById("app-loader");
    if (!loader) return;
    loader.classList.add("fade-out");
    const onEnd = () => loader.remove();
    loader.addEventListener("transitionend", onEnd, { once: true });
    // Fallback: remove after 500ms in case transitionend doesn't fire
    const t = setTimeout(onEnd, 500);
    return () => clearTimeout(t);
  }, []);

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
