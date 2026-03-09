import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { tokenStorage } from "../auth/tokenStorage";
import APP_ENV from "../../env";

const baseUrl = APP_ENV.API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // Якщо отримали 401 помилку - спробуємо оновити токен
  if (result?.error?.status === 401) {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clearTokens();
      return result;
    }

    // Спробуємо оновити токен
    const refreshResult = await rawBaseQuery(
      {
        url: "/Account/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult?.data) {
      const data = refreshResult.data as {
        data?: { accessToken?: string; refreshToken?: string };
      };

      if (data.data?.accessToken) {
        tokenStorage.setTokens(
          data.data.accessToken,
          data.data.refreshToken ?? "",
        );
        // Повторюємо оригінальний запит з новим токеном
        result = await rawBaseQuery(args, api, extraOptions);
      }
    } else {
      // Не вдалося оновити токен - видаляємо все
      tokenStorage.clearTokens();
    }
  }

  return result;
};
