import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  BidVM,
  CreateBidVM,
  UpdateBidIsInterestVM,
  UpdateBidVM,
} from "../../types/bid.types";
import type { ApiResponse } from "../../types/response.types";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const bidsApi = createApi({
  reducerPath: "bidsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Bid"],
  endpoints: (builder) => ({
    getBidsByProject: builder.query<BidVM[], string>({
      query: (projectId) => ({
        url: `/Bid/by-project/${projectId}`,
        method: "GET",
      }),
      providesTags: ["Bid"],
      transformResponse: (response: any) => response.data ?? response,
    }),

    getBidsByFreelancer: builder.query<BidVM[], void>({
      query: () => ({
        url: "/Bid/by-freelancer",
        method: "GET",
      }),
      providesTags: ["Bid"],
      transformResponse: (response: any) => response.data ?? response,
    }),

    createBid: builder.mutation<ApiResponse<BidVM>, CreateBidVM>({
      query: (data) => ({
        url: "/Bid",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bid"],
    }),

    updateBid: builder.mutation<
      ApiResponse<BidVM>,
      { id: string; data: UpdateBidVM }
    >({
      query: ({ id, data }) => ({
        url: `/Bid/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<BidVM>) => response,
      invalidatesTags: ["Bid"],
    }),

    updateBidIsInterest: builder.mutation<
      ApiResponse<BidVM>,
      UpdateBidIsInterestVM
    >({
      query: (data) => ({
        url: `/Bid/is-interesting/${data.bidId}?isInteresting=${data.isInteresting}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bid"],
    }),

    deleteBid: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/Bid/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bid"],
    }),
  }),
});

export const {
  useGetBidsByProjectQuery,
  useGetBidsByFreelancerQuery,
  useCreateBidMutation,
  useUpdateBidIsInterestMutation,
  useUpdateBidMutation,
  useDeleteBidMutation,
} = bidsApi;
