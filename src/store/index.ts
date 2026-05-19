import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../services/auth/authApi";
import { userApi } from "../services/user/userApi";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
import { notificationApi } from "../services/notification/notificationApi";
import { walletApi } from "../services/wallet/walletApi";
import { projectsApi } from "../services/projects/projectsApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      userApi.middleware,
      notificationApi.middleware,
      walletApi.middleware,
      projectsApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
