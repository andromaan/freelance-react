import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { ChatDetailsVM, MessageVM } from "../../types/chat.types";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getChatDetails: builder.query<ChatDetailsVM, string>({
      query: (contractId) => ({
        url: `/chat/${contractId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),
    getChatMessages: builder.query<MessageVM[], string>({
      query: (contractId) => ({
        url: `/chat/${contractId}/messages`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetChatDetailsQuery, useGetChatMessagesQuery } = chatApi;
