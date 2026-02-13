import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/auth.service";
import type { ExternalLoginVM } from "../../types/auth.types";

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
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = async (response: GoogleCallbackResponse) => {
    const { credential } = response;

    if (isLoading) return;

    setIsLoading(true);
    try {
      const externalLoginData: ExternalLoginVM = {
        token: credential,
        provider: "Google",
      };

      const result = await authService.externalLogin(externalLoginData);

      if (!result.success) {
        toast.error(result.message || "Помилка входу через Google");
      } else {
        toast.success("Успішний вхід через Google!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("Помилка з'єднання з сервером");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
      return;
    }

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
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
    <div
      id="loginGoogleBtn"
      style={{
        display: "flex",
        justifyContent: "center",
        opacity: isLoading ? 0.6 : 1,
        pointerEvents: isLoading ? "none" : "auto",
      }}
    />
  );
};

export default GoogleLogin;
