import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { QuoteVM, CreateQuoteVM, UpdateQuoteVM } from "../../types/quote.types";
import type { ApiResponse } from "../../types/response.types";

export const quotesApi = createApi({
  reducerPath: "quotesApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Quote"],
  endpoints: (builder) => ({
    getQuotesByProject: builder.query<QuoteVM[], string>({
      query: (projectId) => ({
        url: `/Quote/by-project/${projectId}`,
        method: "GET",
      }),
      providesTags: ["Quote"],
      transformResponse: (response: any) => response.data ?? response,
    }),

    getQuotesByFreelancer: builder.query<QuoteVM[], void>({
      query: () => ({
        url: "/Quote/by-freelancer",
        method: "GET",
      }),
      providesTags: ["Quote"],
      transformResponse: (response: any) => response.data ?? response,
    }),

    createQuote: builder.mutation<ApiResponse<QuoteVM>, CreateQuoteVM>({
      query: (data) => ({
        url: "/Quote",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quote"],
    }),

    updateQuote: builder.mutation<
      ApiResponse<QuoteVM>,
      { id: string; data: UpdateQuoteVM }
    >({
      query: ({ id, data }) => ({
        url: `/Quote/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<QuoteVM>) => response,
      invalidatesTags: ["Quote"],
    }),

    deleteQuote: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/Quote/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quote"],
    }),
  }),
});

export const {
  useGetQuotesByProjectQuery,
  useGetQuotesByFreelancerQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
} = quotesApi;
