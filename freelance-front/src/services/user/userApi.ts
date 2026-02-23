import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { UserVM } from "../../types/user.types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMyself: builder.query<UserVM, void>({
      query: () => "/User/get-myself",
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetMyselfQuery } = userApi;
