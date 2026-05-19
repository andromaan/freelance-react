import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type {
  ProjectMilestoneVM,
  CreateProjectMilestoneVM,
  UpdateProjectMilestoneVM,
} from "../../types/project-milestone.types";

export const projectMilestonesApi = createApi({
  reducerPath: "projectMilestonesApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["ProjectMilestone"],
  endpoints: (builder) => ({
    // GET /ProjectMilestone/by-project/:projectId
    getProjectMilestonesByProject: builder.query<ProjectMilestoneVM[], string>({
      query: (projectId) => ({
        url: `/ProjectMilestone/by-project/${projectId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ProjectMilestone" as const,
                id,
              })),
              { type: "ProjectMilestone", id: "LIST" },
            ]
          : [{ type: "ProjectMilestone", id: "LIST" }],
    }),

    // GET /ProjectMilestone/:id
    getProjectMilestoneById: builder.query<ProjectMilestoneVM, string>({
      query: (id) => ({ url: `/ProjectMilestone/${id}`, method: "GET" }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: (_result, _err, id) => [{ type: "ProjectMilestone", id }],
    }),

    // POST /ProjectMilestone
    createProjectMilestone: builder.mutation<
      ProjectMilestoneVM,
      CreateProjectMilestoneVM
    >({
      query: (body) => ({
        url: "/ProjectMilestone",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data ?? response,
      invalidatesTags: [{ type: "ProjectMilestone", id: "LIST" }],
    }),

    // PUT /ProjectMilestone/:id
    updateProjectMilestone: builder.mutation<
      ProjectMilestoneVM,
      { id: string; data: UpdateProjectMilestoneVM }
    >({
      query: ({ id, data }) => ({
        url: `/ProjectMilestone/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => response.data ?? response,
      invalidatesTags: (_result, _err, { id }) => [
        { type: "ProjectMilestone", id },
        { type: "ProjectMilestone", id: "LIST" },
      ],
    }),

    // DELETE /ProjectMilestone/:id
    deleteProjectMilestone: builder.mutation<void, string>({
      query: (id) => ({ url: `/ProjectMilestone/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _err, id) => [
        { type: "ProjectMilestone", id },
        { type: "ProjectMilestone", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProjectMilestonesByProjectQuery,
  useGetProjectMilestoneByIdQuery,
  useCreateProjectMilestoneMutation,
  useUpdateProjectMilestoneMutation,
  useDeleteProjectMilestoneMutation,
} = projectMilestonesApi;
