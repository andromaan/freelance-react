import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { ReviewVM } from "../../types/review.types";

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

    getReviewsByEmail: builder.query<ReviewVM[], string>({
      query: (email) => ({
        url: `/Review/by-reviewed-user/${encodeURIComponent(email)}`,
        method: "GET",
      }),
      providesTags: ["Review"],
      transformResponse: (response: any) => response.data ?? response,
    }),

    getAverageRating: builder.query<number, string>({
      query: (email) => ({
        url: `/Review/average-rating/${encodeURIComponent(email)}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewsByEmailQuery,
  useGetAverageRatingQuery,
} = reviewsApi;
