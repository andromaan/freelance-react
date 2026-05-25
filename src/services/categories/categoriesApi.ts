import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { CategoriesVM } from "../../types/category.types";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // GET /Category  — all categories (public)
    getAllCategories: builder.query<CategoriesVM[], void>({
      query: () => ({ url: "/Category", method: "GET" }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoriesApi;
