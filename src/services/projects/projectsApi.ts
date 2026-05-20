import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type {
  ProjectVM,
  UpdateProjectVM,
  UpdateProjectCategoriesVM,
  CreateProjectVM,
} from "../../types/project.types";
import type { ApiResponse } from "../../types/response.types";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    getProjectById: builder.query<ProjectVM, string>({
      query: (id) => ({
        url: `/Project/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: (_result, _err, id) => [{ type: "Project", id }],
    }),

    getProjectsByEmployer: builder.query<ProjectVM[], void>({
      query: () => ({
        url: `/Project/by-employer`,
        method: "GET",
      }),
      transformResponse: (response: { data: ProjectVM[] }) => response.data ?? response,
      providesTags: ["Project"],
    }),

    // POST /Project  — create new project
    createProject: builder.mutation<ApiResponse<ProjectVM>, CreateProjectVM>({
      query: (data) => ({
        url: `/Project`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<ProjectVM>) => response,
      invalidatesTags: ["Project"],
    }),

    // PUT /Project/:id  — update title, description, budget, deadline
    updateProject: builder.mutation<ApiResponse<ProjectVM>, { id: string; data: UpdateProjectVM }>({
      query: ({ id, data }) => ({
        url: `/Project/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<ProjectVM>) => response,
      invalidatesTags: (_result, _err, { id }) => [{ type: "Project", id }],
    }),

    // PATCH /Project/categories/:projectId  — replace category list
    updateProjectCategories: builder.mutation<
      ApiResponse<void>,
      { projectId: string; data: UpdateProjectCategoriesVM }
    >({
      query: ({ projectId, data }) => ({
        url: `/Project/categories/${projectId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, { projectId }) => [
        { type: "Project", id: projectId },
      ],
    }),

    // DELETE /Project/:id
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/Project/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectByIdQuery,
  useGetProjectsByEmployerQuery,
  useUpdateProjectMutation,
  useUpdateProjectCategoriesMutation,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
