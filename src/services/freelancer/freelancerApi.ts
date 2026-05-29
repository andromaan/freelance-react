import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { FreelancerVM, FreelancerFilterVM, SearchFreelancerVM } from "../../types/freelancer.types";
import type { PaginatedItemsVM } from "../../types/pagination.types";

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

    searchFreelancers: builder.query<PaginatedItemsVM<SearchFreelancerVM>, FreelancerFilterVM>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        queryParams.append("Page", params.page.toString());
        queryParams.append("PageSize", params.pageSize.toString());
        
        if (params.name) queryParams.append("Name", params.name);
        if (params.email) queryParams.append("Email", params.email);
        if (params.minRating !== undefined) queryParams.append("MinRating", params.minRating.toString());
        
        if (params.skillIds && params.skillIds.length > 0) {
          params.skillIds.forEach(id => queryParams.append("SkillIds", id.toString()));
        }
        if (params.languageIds && params.languageIds.length > 0) {
          params.languageIds.forEach(id => queryParams.append("LanguageIds", id.toString()));
        }
        if (params.countryIds && params.countryIds.length > 0) {
          params.countryIds.forEach(id => queryParams.append("CountryIds", id.toString()));
        }

        return {
          url: `/Freelancer/search?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Freelancer"],
      transformResponse: (response: any) => response.data ?? response,
    }),

    updateFreelancer: builder.mutation<void, { bio: string | null; location: string | null }>({
      query: (body) => ({
        url: "/Freelancer",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Freelancer"],
    }),

    updateFreelancerSkills: builder.mutation<void, { skillIds: number[] }>({
      query: (body) => ({
        url: "/Freelancer/skills",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Freelancer"],
    }),

    addPortfolio: builder.mutation<void, { title: string; description?: string; portfolioUrl?: string }>({
      query: (body) => ({
        url: "/FreelancerPortfolio",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Freelancer"],
    }),

    removePortfolio: builder.mutation<void, string>({
      query: (id) => ({
        url: `/FreelancerPortfolio/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Freelancer"],
    }),
  }),
});

export const { 
  useGetFreelancerByEmailQuery, 
  useSearchFreelancersQuery,
  useUpdateFreelancerMutation,
  useUpdateFreelancerSkillsMutation,
  useAddPortfolioMutation,
  useRemovePortfolioMutation
} = freelancerApi;
