import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";
import type { ContractVM } from "../../types/contract.types";
import type {
  ContractMilestoneVM,
  UpdContractMilestoneStatusEmployerVM,
  UpdContractMilestoneStatusFreelancerVM,
} from "../../types/contract-milestone.types";
import type { ApiResponse } from "../../types/response.types";

export const contractsApi = createApi({
  reducerPath: "contractsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Contract", "ContractMilestone"],
  endpoints: (builder) => ({
    getContractsByUser: builder.query<ContractVM[], void>({
      query: () => ({
        url: "/Contract/by-user",
        method: "GET",
      }),
      providesTags: ["Contract"],
      transformResponse: (response: any) => response.data ?? response,
    }),

    getContractById: builder.query<ContractVM, string>({
      query: (contractId) => ({
        url: `/Contract/${contractId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, arg) => [{ type: "Contract", id: arg }],
      transformResponse: (response: ApiResponse<ContractVM>) => response.data,
    }),

    isExistsByQuote: builder.query<boolean, string>({
      query: (quoteId) => ({
        url: `/Contract/is-exists-by-quote/${quoteId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: boolean }) => response.data,
      providesTags: ["Contract"],
    }),

    createContract: builder.mutation<ApiResponse<ContractVM>, string>({
      query: (quoteId) => ({
        url: `/Contract/${quoteId}`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<ContractVM>) => response,
      invalidatesTags: ["Contract"],
    }),

    canContractBeCreated: builder.query<boolean, string>({
      query: (quoteId) => ({
        url: `/Contract/can-contract-be-created/${quoteId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: boolean }) => response.data,
      providesTags: ["Contract"],
    }),

    getContractMilestones: builder.query<ContractMilestoneVM[], string>({
      query: (contractId) => ({
        url: `/ContractMilestone/by-contract/${contractId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, arg) => [{ type: "ContractMilestone", id: arg }],
      transformResponse: (response: ApiResponse<ContractMilestoneVM[]>) => response.data ?? [],
    }),

    updateContractMilestoneFreelancer: builder.mutation<
      ApiResponse<ContractMilestoneVM>,
      { id: string; statusVM: UpdContractMilestoneStatusFreelancerVM }
    >({
      query: ({ id, statusVM }) => ({
        url: `/ContractMilestone/status/${id}/freelancer`,
        method: "PUT",
        body: statusVM,
      }),
      invalidatesTags: (result, _error, _arg) => [
        { type: "ContractMilestone", id: result?.data?.contractId },
      ],
    }),

    updateContractMilestoneEmployer: builder.mutation<
      ApiResponse<ContractMilestoneVM>,
      { id: string; statusVM: UpdContractMilestoneStatusEmployerVM }
    >({
      query: ({ id, statusVM }) => ({
        url: `/ContractMilestone/status/${id}/employer`,
        method: "PUT",
        body: statusVM,
      }),
      invalidatesTags: (result, _error, _arg) => [
        { type: "ContractMilestone", id: result?.data?.contractId },
      ],
    }),

    getCompletedContractsByFreelancer: builder.query<ContractVM[], string>({
      query: (freelancerId) => ({
        url: `/Contract/completed-by-freelancer-id/${freelancerId}`,
        method: "GET",
      }),
      providesTags: ["Contract"],
      transformResponse: (response: any) => response.data ?? response,
    }),
  }),
});

export const {
  useGetContractByIdQuery,
  useGetContractsByUserQuery,
  useIsExistsByQuoteQuery,
  useCreateContractMutation,
  useCanContractBeCreatedQuery,
  useGetContractMilestonesQuery,
  useUpdateContractMilestoneFreelancerMutation,
  useUpdateContractMilestoneEmployerMutation,
  useGetCompletedContractsByFreelancerQuery,
} = contractsApi;
