import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { ProjectVM } from "../../types/project.types";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    getProjectsByEmployer: builder.query<ProjectVM[], void>({
      query: () => ({
        url: `/Project/by-employer`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["Project"],
    }),
})
});

export const {
  useGetProjectsByEmployerQuery,
} = projectsApi;
