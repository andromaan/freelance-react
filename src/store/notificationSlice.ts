import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { NotificationVM } from "../types/notification.types";

interface NotificationState {
  all_not_read_items: NotificationVM[];
  max_items: NotificationVM[];
  unreadCount: number;
}

const initialState: NotificationState = {
  all_not_read_items: [],
  max_items: [],
  unreadCount: 0,
};

const MAX_NOTIFICATIONS = 10;

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationVM>) => {
      state.max_items.unshift(action.payload); // нові зверху
      state.max_items = state.max_items.slice(0, MAX_NOTIFICATIONS);
      if (!action.payload.isRead) {
        state.all_not_read_items.push(action.payload);
        state.unreadCount += 1;
      }
    },
    addNotifications: (state, action: PayloadAction<NotificationVM[]>) => {
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      state.all_not_read_items = action.payload.filter((n) => !n.isRead);
      state.max_items = state.all_not_read_items.slice(0, MAX_NOTIFICATIONS);
    },
    markAllAsRead: (state) => {
      state.max_items = [];
      state.all_not_read_items = [];
      state.unreadCount = 0;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.all_not_read_items.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.all_not_read_items = state.all_not_read_items.filter((n) => n.id !== action.payload);
        state.max_items = state.all_not_read_items.slice(0, MAX_NOTIFICATIONS);
      }
    },
    clearNotifications: (state) => {
      state.max_items = [];
      state.all_not_read_items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAllAsRead,
  markAsRead,
  clearNotifications,
  addNotifications,
} = notificationSlice.actions;

export const selectNotifications = (state: {
  notifications: NotificationState;
}) => state.notifications.max_items;
export const selectUnreadCount = (state: {
  notifications: NotificationState;
}) => state.notifications.unreadCount;

export default notificationSlice.reducer;