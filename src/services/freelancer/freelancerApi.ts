import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { FreelancerVM } from "../../types/freelancer.types";

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Freelancer"],
  endpoints: (builder) => ({
    getFreelancerByProject: builder.query<FreelancerVM[], string>({
      query: (userId) => ({
        url: `/Freelancer/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetFreelancerByProjectQuery } = freelancerApi;
