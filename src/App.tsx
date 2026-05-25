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
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/ThemeContext";

// ── Завантаження даних користувача та SignalR ──────────────────────────────────
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

// ── Toast, що реагує на ThemeContext ──────────────────────────────────────────
const ThemedToast: React.FC = () => {
  const { theme } = useTheme(); // підписується на контекст — оновлюється миттєво
  const isDark = theme === "dark";

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDark ? "dark" : "light"}
      toastStyle={{
        borderRadius: "0.75rem",
        border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
        background: isDark ? "#1f2937" : "#fff",
        boxShadow: isDark
          ? "0 8px 24px #00000073"
          : "0 8px 24px rgba(0,0,0,0.10)",
        fontSize: "0.875rem",
        fontFamily: "inherit",
      }}
    />
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  useEffect(() => {
    const loader = document.getElementById("app-loader");
    if (!loader) return;
    loader.classList.add("fade-out");
    const onEnd = () => loader.remove();
    loader.addEventListener("transitionend", onEnd, { once: true });
    const t = setTimeout(onEnd, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemedToast />
        <UserLoader />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;