import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { EmployerVM } from "../../types/employer.types"; // I might need to create this type if it doesn't exist.

export const employerApi = createApi({
  reducerPath: "employerApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Employer"],
  endpoints: (builder) => ({
    getEmployer: builder.query<EmployerVM, void>({
      query: () => ({
        url: `/Employer`,
        method: "GET",
      }),
      providesTags: ["Employer"],
      transformResponse: (response: any) => response.data ?? response,
    }),

    getEmployerByEmail: builder.query<EmployerVM, string>({
      query: (email) => ({
        url: `/Employer/${email}`,
        method: "GET",
      }),
      providesTags: (_result, _error, email) => [{ type: "Employer", id: email }],
      transformResponse: (response: any) => response.data ?? response,
    }),

    updateEmployer: builder.mutation<void, { companyName: string | null; companyWebsite: string | null }>({
      query: (body) => ({
        url: "/Employer",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Employer"],
    }),
  }),
});

export const { useGetEmployerQuery, useGetEmployerByEmailQuery, useUpdateEmployerMutation } = employerApi;
