import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { BidVM, CreateBidVM } from "../../types/bid.types";
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
  }),
});

export const { useGetBidsByProjectQuery, useCreateBidMutation } = bidsApi;
