import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { NotificationVM } from "../../types/notification.types";
import type {
  NotificationPagedVM,
  PagedVM,
  PaginatedItemsVM,
} from "../../types/pagination.types";

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
      query: ({ page, pageSize, isRead, notificationType }) => {
        const params = new URLSearchParams({
          Page: String(page),
          PageSize: String(pageSize),
        });
        if (isRead != null) params.append("IsRead", String(isRead));
        if (notificationType != null)
          params.append("NotificationType", String(notificationType));
        return {
          url: `/Notification/filtered?${params.toString()}`,
          method: "GET",
        };
      },
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
