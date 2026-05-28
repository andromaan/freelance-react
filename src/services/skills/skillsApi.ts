import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { SkillVM } from "../../types/freelancer.types";

export const skillsApi = createApi({
  reducerPath: "skillsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Skill"],
  endpoints: (builder) => ({
    getSkills: builder.query<SkillVM[], void>({
      query: () => "/Skill",
      providesTags: ["Skill"],
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetSkillsQuery } = skillsApi;
