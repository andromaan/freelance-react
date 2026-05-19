import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { BidVM } from "../../types/bid.types";

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
  }),
});

export const { useGetBidsByProjectQuery } = bidsApi;
