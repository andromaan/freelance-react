import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    createReview: builder.mutation<
      void,
      { contractId: string; rating: number; reviewText?: string | null }
    >({
      query: (data) => ({
        url: "/Review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const { useCreateReviewMutation } = reviewsApi;
