import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { FreelancerVM } from "../../types/freelancer.types";

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Freelancer"],
  endpoints: (builder) => ({
    getFreelancerByEmail: builder.query<FreelancerVM, string>({
      query: (email) => ({
        url: `/Freelancer/${email}`,
        method: "GET",
      }),
      providesTags: (_result, _error, email) => [{ type: "Freelancer", id: email }],
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetFreelancerByEmailQuery } = freelancerApi;
