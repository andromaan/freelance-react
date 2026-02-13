import { api } from "./api.config";
import type {
  SignInVM,
  SignUpVM,
  ExternalLoginVM,
  AuthResponse,
} from "../types/auth.types";

export const authService = {
  // Реєстрація
  signUp: async (data: SignUpVM): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/Account/sign-up", data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return {
        ...response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Помилка реєстрації",
      };
    }
  },

  // Вхід
  signIn: async (data: SignInVM): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/Account/sign-in", data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return {
        ...response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Помилка входу",
      };
    }
  },

  // Google авторизація
  externalLogin: async (data: ExternalLoginVM): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/Account/external-login",
        data,
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return {
        ...response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Помилка авторизації через Google",
      };
    }
  },

  // Вихід
  logout: () => {
    localStorage.removeItem("token");
  },

  // Перевірка авторизації
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};
