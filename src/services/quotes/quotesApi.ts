import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { QuoteVM } from "../../types/quote.types";

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
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetQuotesByProjectQuery } = quotesApi;
