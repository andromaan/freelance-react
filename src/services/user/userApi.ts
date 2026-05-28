import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { UserVM } from "../../types/user.types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMyself: builder.query<UserVM, void>({
      query: () => "/User/get-myself",
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["User"],
    }),

    getUserById: builder.query<UserVM, string>({
      query: (userId) => `User/${userId}`,
      transformResponse: (response: any) => response.data ?? response,
    }),

    updateUser: builder.mutation<void, { displayName: string | null; countryId: number }>({
      query: (body) => ({
        url: "/User",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    getProficiencyLevels: builder.query<{ name: string; value: number }[], void>({
      query: () => "/User/proficiency-levels",
      transformResponse: (response: any) => response.data ?? response,
    }),

    addUserLanguage: builder.mutation<void, { languageId: number; proficiencyLevel: number }>({
      query: (body) => ({
        url: "/User/languages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    removeUserLanguage: builder.mutation<void, number>({
      query: (languageId) => ({
        url: `/User/languages/${languageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
  useGetMyselfQuery, 
  useGetUserByIdQuery, 
  useUpdateUserMutation,
  useGetProficiencyLevelsQuery,
  useAddUserLanguageMutation,
  useRemoveUserLanguageMutation
} = userApi;
