import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { FreelancerVM } from "../../types/freelancer.types";

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Freelancer"],
  endpoints: (builder) => ({
    getFreelancerByUserId: builder.query<FreelancerVM, string>({
      query: (userId) => ({
        url: `/Freelancer/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "Freelancer", id: userId }],
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetFreelancerByUserIdQuery } = freelancerApi;
