import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { ContractVM } from "../../types/contract.types";
import type { ApiResponse } from "../../types/response.types";

export const contractsApi = createApi({
  reducerPath: "contractsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Contract"],
  endpoints: (builder) => ({
    canContractBeCreated: builder.query<boolean, string>({
      query: (quoteId) => ({
        url: `/Contract/can-contract-be-created/${quoteId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: boolean }) => response.data,
      providesTags: ["Contract"],
    }),

    isExistsByQuote: builder.query<boolean, string>({
      query: (quoteId) => ({
        url: `/Contract/is-exists-by-quote/${quoteId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: boolean }) => response.data,
      providesTags: ["Contract"],
    }),

    createContract: builder.mutation<ApiResponse<ContractVM>, string>({
      query: (quoteId) => ({
        url: `/Contract/${quoteId}`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<ContractVM>) => response,
      invalidatesTags: ["Contract"],
    }),
  }),
});

export const {
  useCreateContractMutation,
  useCanContractBeCreatedQuery,
  useIsExistsByQuoteQuery,
} = contractsApi;
