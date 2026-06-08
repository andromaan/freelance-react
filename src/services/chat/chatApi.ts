import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { ChatDetailsVM, MessageVM } from "../../types/chat.types";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getChatDetails: builder.query<ChatDetailsVM, string>({
      query: (contractId) => ({
        url: `/chat/${contractId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["Chat"],
    }),
    getChatMessages: builder.query<MessageVM[], string>({
      query: (contractId) => ({
        url: `/chat/${contractId}/messages`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["Chat"],
    }),
  }),
});

export const { useGetChatDetailsQuery, useGetChatMessagesQuery } = chatApi;
