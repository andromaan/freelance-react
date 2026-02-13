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
      const response = await api.post<any>("/Account/sign-up", data);

      // Якщо є токен в data (JWT токени)
      if (response.data.data) {
        const tokens = response.data.data;
        if (tokens.token) {
          localStorage.setItem("token", tokens.token);
        }
        if (tokens.refreshToken) {
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }
      }

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
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
      const response = await api.post<any>("/Account/sign-in", data);

      // Якщо є токен в data (JWT токени)
      if (response.data.data) {
        const tokens = response.data.data;
        if (tokens.token) {
          localStorage.setItem("token", tokens.token);
        }
        if (tokens.refreshToken) {
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }
      }

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
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
      const response = await api.post<any>("/Account/external-login", data);

      // Якщо є токен в data (JWT токени)
      if (response.data.data) {
        const tokens = response.data.data;
        if (tokens.token) {
          localStorage.setItem("token", tokens.token);
        }
        if (tokens.refreshToken) {
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }
      }

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error: any) {
      const errorResponse = error.response?.data;
      return {
        success: false,
        message: errorResponse?.message || "Помилка авторизації через Google",
        data: errorResponse?.data, // Важливо для перевірки "role_required"
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
