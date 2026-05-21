import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type {
  BidVM,
  CreateBidVM,
  UpdateBidIsInterestVM,
} from "../../types/bid.types";
import type { ApiResponse } from "../../types/response.types";

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

    createBid: builder.mutation<ApiResponse<BidVM>, CreateBidVM>({
      query: (data) => ({
        url: "/Bid",
        method: "POST",
        body: data,
      }),
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
  }),
});

export const {
  useGetBidsByProjectQuery,
  useCreateBidMutation,
  useUpdateBidIsInterestMutation,
} = bidsApi;
