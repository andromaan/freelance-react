import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type {
  WalletBalanceVM,
  CreatePaymentIntentVM,
  CreatePaymentIntentResponse,
  ConfirmDepositVM,
} from "../../types/wallet.types";

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Wallet"],
  endpoints: (builder) => ({
    getBalance: builder.query<WalletBalanceVM, void>({
      query: () => ({
        url: "/Wallet/balance",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["Wallet"],
    }),

    createPaymentIntent: builder.mutation<
      CreatePaymentIntentResponse,
      CreatePaymentIntentVM
    >({
      query: (vm) => ({
        url: "/Wallet/create-payment-intent",
        method: "POST",
        body: vm,
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),

    confirmDeposit: builder.mutation<void, ConfirmDepositVM>({
      query: (vm) => ({
        url: "/Wallet/confirm-deposit",
        method: "POST",
        body: vm,
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetBalanceQuery,
  useCreatePaymentIntentMutation,
  useConfirmDepositMutation,
} = walletApi;
