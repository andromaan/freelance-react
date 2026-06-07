import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { CreateDisputeVM, DisputeVM } from "../../types/dispute.types";
import type { ApiResponse } from "../../types/response.types";

export const disputesApi = createApi({
  reducerPath: "disputesApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Dispute"],
  endpoints: (builder) => ({
    createDispute: builder.mutation<DisputeVM, CreateDisputeVM>({
      query: (body) => ({
        url: "/Dispute",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<DisputeVM>) => response.data,
      invalidatesTags: ["Dispute"],
    }),
    getDisputesByUser: builder.query<DisputeVM[], void>({
      query: () => ({
        url: "/Dispute/by-user",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DisputeVM[]>) => response.data,
      providesTags: ["Dispute"],
    }),
  }),
});

export const {
  useCreateDisputeMutation,
  useGetDisputesByUserQuery,
} = disputesApi;
