import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import { tokenStorage } from "./tokenStorage";
import type {
  SignInVM,
  SignUpVM,
  ExternalLoginVM,
  AuthResponse,
} from "../../types/auth.types";
import i18n from "../../i18n";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, SignInVM>({
      query: (credentials) => ({
        url: "/Account/sign-in",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => {
        if (response.data?.accessToken) {
          tokenStorage.setTokens(
            response.data.accessToken,
            response.data.refreshToken ?? "",
          );
        }
        return {
          success: true,
          message: response.message || "Успішний вхід",
          data: response.data,
        };
      },
      transformErrorResponse: (response: any) => ({
        success: false,
        message: response.data?.message || i18n.t("auth.loginError"),
        data: response.data?.data,
        errors: response.data?.errors,
      }),
    }),

    signUp: builder.mutation<AuthResponse, SignUpVM>({
      query: (userData) => ({
        url: "/Account/sign-up",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: any) => {
        if (response.data?.accessToken) {
          tokenStorage.setTokens(
            response.data.accessToken,
            response.data.refreshToken ?? "",
          );
        }
        return {
          success: true,
          message: response.message || "Успішна реєстрація",
          data: response.data,
        };
      },
      transformErrorResponse: (response: any) => ({
        success: false,
        message: response.data?.message || i18n.t("auth.registerError"),
        data: response.data?.data,
        errors: response.data?.errors,
      }),
    }),

    externalLogin: builder.mutation<AuthResponse, ExternalLoginVM>({
      query: (externalData) => ({
        url: "/Account/external-login",
        method: "POST",
        body: externalData,
      }),
      transformResponse: (response: any) => {
        if (response.data?.accessToken) {
          tokenStorage.setTokens(
            response.data.accessToken,
            response.data.refreshToken ?? "",
          );
        }
        return {
          success: true,
          message: response.message || "Успішний вхід через Google",
          data: response.data,
        };
      },
      transformErrorResponse: (response: any) => ({
        success: false,
        message: response.data?.message || i18n.t("auth.loginError"),
        data: response.data?.data,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useExternalLoginMutation,
} = authApi;
