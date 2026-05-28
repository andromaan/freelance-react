import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { LanguageVM } from "../../types/language.types";

export const languagesApi = createApi({
  reducerPath: "languagesApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Language"],
  endpoints: (builder) => ({
    getLanguages: builder.query<LanguageVM[], void>({
      query: () => ({
        url: "/Language",
        method: "GET",
      }),
      providesTags: ["Language"],
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetLanguagesQuery } = languagesApi;
