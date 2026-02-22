import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
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
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // Немає refresh токена - видаляємо все і редирект на логін
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
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
        data?: { token?: string; refreshToken?: string };
      };

      if (data.data?.token) {
        // Зберігаємо новий токен
        localStorage.setItem("token", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        // Повторюємо оригінальний запит з новим токеном
        result = await rawBaseQuery(args, api, extraOptions);
      }
    } else {
      // Не вдалося оновити токен - видаляємо все
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  }

  return result;
};
