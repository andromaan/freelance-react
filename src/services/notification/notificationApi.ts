import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type {
  NotificationVM,
  NotificationPagedVM,
} from "../../types/notification.types";
import type { PagedVM, PaginatedItemsVM } from "../../types/pagination.types";
import { buildQueryParams } from "../utils/queryParams";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotificationsPaginated: builder.query<
      PaginatedItemsVM<NotificationVM>,
      PagedVM
    >({
      query: ({ page, pageSize }) => ({
        url: `/Notification/paginated?Page=${page}&PageSize=${pageSize}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["Notification"],
    }),
    getNotificationsPaginatedFiltered: builder.query<
      PaginatedItemsVM<NotificationVM>,
      NotificationPagedVM
    >({
      query: (filter) => ({
        url: `/Notification/filtered?${buildQueryParams(filter)}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["Notification"],
    }),
    getAllNotRead: builder.query<NotificationVM[], void>({
      query: () => ({
        url: `/Notification/is-not-read`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["Notification"],
    }),
    toggleIsRead: builder.mutation({
      query: (id: string) => ({
        url: `/Notification/${id}/toggle-read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    readAll: builder.mutation<void, void>({
      query: () => ({
        url: `/Notification/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    getNotificationTypesEmployer: builder.query<
      { name: string; value: number }[],
      void
    >({
      query: () => ({
        url: `/Notification/type-employer-enums`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),
    getNotificationTypesFreelancer: builder.query<
      { name: string; value: number }[],
      void
    >({
      query: () => ({
        url: `/Notification/type-freelancer-enums`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const {
  useGetNotificationsPaginatedQuery,
  useGetNotificationsPaginatedFilteredQuery,
  useToggleIsReadMutation,
  useReadAllMutation,
  useGetAllNotReadQuery,
  useGetNotificationTypesEmployerQuery,
  useGetNotificationTypesFreelancerQuery,
} = notificationApi;
