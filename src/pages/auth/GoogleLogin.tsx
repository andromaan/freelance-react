import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useExternalLoginMutation } from "../../services/auth/authApi";
import { useDispatch } from "react-redux";
import { userApi } from "../../services/user/userApi";
import type { AppDispatch } from "../../store";
import type { ExternalLoginVM, UserRole } from "../../types/auth.types";
import { UserRoles } from "../../types/auth.types";
import APP_ENV from "../../env";

// Типи для Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          renderButton: (
            parent: HTMLElement,
            options: GoogleButtonConfiguration,
          ) => void;
        };
      };
    };
  }
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCallbackResponse) => void;
  locale?: string;
  ux_mode?: string;
  auto_select?: boolean;
}

interface GoogleCallbackResponse {
  credential: string;
}

interface GoogleButtonConfiguration {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  shape?: "rectangular" | "pill" | "circle" | "square";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  width?: number;
}

const GoogleLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [externalLogin, { isLoading }] = useExternalLoginMutation();
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState<string | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    UserRoles.FREELANCER,
  );

  const handleLoginSuccess = async (response: GoogleCallbackResponse) => {
    const { credential } = response;

    if (isLoading) return;

    try {
      const externalLoginData: ExternalLoginVM = {
        token: credential,
        provider: "Google",
      };

      await externalLogin(externalLoginData).unwrap();
      dispatch(
        userApi.endpoints.getMyself.initiate(undefined, { forceRefetch: true }),
      );
      toast.success("Успішний вхід через Google!");
      navigate("/");
    } catch (error: any) {
      // Перевіряємо чи потрібен вибір ролі
      if (error?.data === "role_required") {
        setPendingGoogleToken(credential);
        setShowRoleSelection(true);
        return;
      }
      const errorMessage =
        error?.message || error?.data?.message || "Помилка входу через Google";
      toast.error(errorMessage);
    }
  };

  const handleRoleSubmit = async () => {
    if (!pendingGoogleToken) return;

    try {
      const externalLoginData: ExternalLoginVM = {
        token: pendingGoogleToken,
        provider: "Google",
        userRole: selectedRole,
      };

      await externalLogin(externalLoginData).unwrap();
      dispatch(
        userApi.endpoints.getMyself.initiate(undefined, { forceRefetch: true }),
      );
      toast.success("Успішна реєстрація через Google!");
      navigate("/");
      setShowRoleSelection(false);
      setPendingGoogleToken(null);
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        "Помилка реєстрації через Google";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const loadGoogleApi = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client?hl=uk";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleApiLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadGoogleApi();
  }, [navigate]);

  useEffect(() => {
    if (googleApiLoaded && window.google) {
      // Отримуємо Client ID з змінних оточення
      const clientId = APP_ENV.GOOGLE_CLIENT_ID;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleLoginSuccess,
        locale: "uk",
        ux_mode: "popup",
        auto_select: false,
      });

      const buttonDiv = document.getElementById("loginGoogleBtn");
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 280,
        });
      }
    }
  }, [googleApiLoaded]);

  return (
    <>
      {showRoleSelection && (
        <div className="modal-overlay fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-5">
          <div className="modal-content bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="m-0 mb-3 text-gray-900 dark:text-white text-xl font-semibold text-center">
              Виберіть роль
            </h3>
            <p className="m-0 mb-6 text-gray-600 dark:text-gray-400 text-sm text-center">
              Для завершення реєстрації оберіть вашу роль:
            </p>
            <div className="flex flex-col gap-3 mb-6">
              <label className="flex items-center px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-gray-700">
                <input
                  type="radio"
                  name="role"
                  value={UserRoles.FREELANCER}
                  checked={selectedRole === UserRoles.FREELANCER}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  disabled={isLoading}
                  className="w-4 h-4 mr-3 cursor-pointer accent-primary"
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Фрілансер
                </span>
              </label>
              <label className="flex items-center px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-gray-700">
                <input
                  type="radio"
                  name="role"
                  value={UserRoles.EMPLOYER}
                  checked={selectedRole === UserRoles.EMPLOYER}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  disabled={isLoading}
                  className="w-4 h-4 mr-3 cursor-pointer accent-primary"
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Роботодавець
                </span>
              </label>
            </div>
            <button
              onClick={handleRoleSubmit}
              className="bg-primary hover:bg-primary-hover text-white border-none rounded-lg px-3 py-3 text-base font-medium cursor-pointer transition-all w-full disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Завантаження..." : "Продовжити"}
            </button>
          </div>
        </div>
      )}
      <div
        id="loginGoogleBtn"
        style={{
          display: showRoleSelection ? "none" : "flex",
          justifyContent: "center",
          opacity: isLoading ? 0.6 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      />
    </>
  );
};

export default GoogleLogin;
