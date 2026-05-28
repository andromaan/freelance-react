import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export interface CountryVM {
  id: number;
  name: string;
}

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getCountries: builder.query<CountryVM[], void>({
      query: () => "/Country",
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
