import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import { tokenStorage } from "./tokenStorage";
import type {
  SignInVM,
  SignUpVM,
  ExternalLoginVM,
  AuthResponse,
} from "../../types/auth.types";

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
        message: response.data?.message || "Помилка входу",
        data: response.data?.data,
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
        message: response.data?.message || "Помилка реєстрації",
        data: response.data?.data,
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
        message: response.data?.message || "Помилка авторизації через Google",
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
