import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../services/auth/authApi";
import { userApi } from "../services/user/userApi";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
import { notificationApi } from "../services/notification/notificationApi";
import { walletApi } from "../services/wallet/walletApi";
import { projectsApi } from "../services/projects/projectsApi";
import { bidsApi } from "../services/bids/bidsApi";
import { quotesApi } from "../services/quotes/quotesApi";
import { projectMilestonesApi } from "../services/project-milestones/project-milestonesApi";
import { categoriesApi } from "../services/categories/categoriesApi";
import { contractsApi } from "../services/contracts/contractsApi";
import { contractMilestonesApi } from "../services/contract-milestone/contractMilestoneApi";
import { reviewsApi } from "../services/reviews/reviewsApi";
import { freelancerApi } from "../services/freelancer/freelancerApi";
import { languagesApi } from "../services/languages/languagesApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [bidsApi.reducerPath]: bidsApi.reducer,
    [quotesApi.reducerPath]: quotesApi.reducer,
    [projectMilestonesApi.reducerPath]: projectMilestonesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [contractsApi.reducerPath]: contractsApi.reducer,
    [contractMilestonesApi.reducerPath]: contractMilestonesApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [freelancerApi.reducerPath]: freelancerApi.reducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
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
      bidsApi.middleware,
      quotesApi.middleware,
      projectMilestonesApi.middleware,
      categoriesApi.middleware,
      contractsApi.middleware,
      contractMilestonesApi.middleware,
      reviewsApi.middleware,
      freelancerApi.middleware,
      languagesApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
