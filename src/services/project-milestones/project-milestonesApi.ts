import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { ProjectMilestoneVM } from "../../types/project-milestone.types";

export const projectMilestonesApi = createApi({
  reducerPath: "projectMilestonesApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["ProjectMilestone"],
  endpoints: (builder) => ({
    getProjectMilestonesByProject: builder.query<ProjectMilestoneVM[], string>({
      query: (projectId) => ({
        url: `/ProjectMilestone/by-project/${projectId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetProjectMilestonesByProjectQuery } = projectMilestonesApi;
