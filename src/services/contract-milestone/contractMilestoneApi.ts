import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  ContractMilestoneVM,
  CreateContractMilestoneVM,
  UpdContractMilestoneStatusEmployerVM,
  UpdContractMilestoneStatusFreelancerVM,
  UpdateContractMilestoneVM,
} from "../../types/contract-milestone.types";
import type { ApiResponse } from "../../types/response.types";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const contractMilestonesApi = createApi({
  reducerPath: "contractMilestonesApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["ContractMilestone", "Contract"],
  endpoints: (builder) => ({
    // GET /ContractMilestone/by-contract/:contractId
    getContractMilestonesByContract: builder.query<
      ContractMilestoneVM[],
      string
    >({
      query: (contractId) => ({
        url: `/ContractMilestone/by-contract/${contractId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: ContractMilestoneVM[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ContractMilestone" as const,
                id,
              })),
              { type: "ContractMilestone", id: "LIST" },
            ]
          : [{ type: "ContractMilestone", id: "LIST" }],
    }),

    // GET /ContractMilestone/milestone-status-enums
    getContractMilestoneStatusEnums: builder.query<string[], void>({
      query: () => ({
        url: `/ContractMilestone/milestone-status-enums`,
        method: "GET",
      }),
      transformResponse: (response: { data: string[] }) => response.data,
    }),

    // GET /ContractMilestone/status-freelancer-enums
    getContractMilestoneStatusFreelancerEnums: builder.query<string[], void>({
      query: () => ({
        url: `/ContractMilestone/status-freelancer-enums`,
        method: "GET",
      }),
      transformResponse: (response: { data: string[] }) => response.data,
    }),

    // GET /ContractMilestone/status-employer-enums
    getContractMilestoneStatusEmployerEnums: builder.query<string[], void>({
      query: () => ({
        url: `/ContractMilestone/status-employer-enums`,
        method: "GET",
      }),
      transformResponse: (response: { data: string[] }) => response.data,
    }),

    // GET /ContractMilestone/status-moderator-enums
    getContractMilestoneStatusModeratorEnums: builder.query<string[], void>({
      query: () => ({
        url: `/ContractMilestone/status-moderator-enums`,
        method: "GET",
      }),
      transformResponse: (response: { data: string[] }) => response.data,
    }),

    // PUT /ContractMilestone/status/:id/freelancer
    updateContractMilestoneStatusFreelancer: builder.mutation<
      ApiResponse<ContractMilestoneVM>,
      { id: string; data: UpdContractMilestoneStatusFreelancerVM }
    >({
      query: ({ id, data }) => ({
        url: `/ContractMilestone/status/${id}/freelancer`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, _error, _arg) => [
        { type: "ContractMilestone", id: "LIST" }, // список milestone'ів
        { type: "Contract", id: result?.data?.contractId }, // ← конкретний контракт
        { type: "Contract", id: "DETAIL" }, // ← всі деталі контрактів
        { type: "Contract", id: "LIST" }, // ← список контрактів
      ],
    }),

    // PUT /ContractMilestone/status/:id/employer
    updateContractMilestoneStatusEmployer: builder.mutation<
      ApiResponse<ContractMilestoneVM>,
      { id: string; data: UpdContractMilestoneStatusEmployerVM }
    >({
      query: ({ id, data }) => ({
        url: `/ContractMilestone/status/${id}/employer`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, _error, _arg) => [
        { type: "ContractMilestone", id: "LIST" },
        { type: "Contract", id: result?.data?.contractId },
        { type: "Contract", id: "DETAIL" },
        { type: "Contract", id: "LIST" },
      ],
    }),

    // GET /ContractMilestone/:id
    getContractMilestoneById: builder.query<ContractMilestoneVM, string>({
      query: (id) => ({
        url: `/ContractMilestone/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: ContractMilestoneVM }) =>
        response.data,
      providesTags: (_result, _err, id) => [{ type: "ContractMilestone", id }],
    }),

    // PUT /ContractMilestone/:id
    updateContractMilestone: builder.mutation<
      ApiResponse<ContractMilestoneVM>,
      { id: string; data: UpdateContractMilestoneVM }
    >({
      query: ({ id, data }) => ({
        url: `/ContractMilestone/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "ContractMilestone", id },
        { type: "ContractMilestone", id: "LIST" },
      ],
    }),

    // DELETE /ContractMilestone/:id
    deleteContractMilestone: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ContractMilestone/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "ContractMilestone", id },
        { type: "ContractMilestone", id: "LIST" },
      ],
    }),

    // POST /ContractMilestone
    createContractMilestone: builder.mutation<
      ApiResponse<ContractMilestoneVM>,
      CreateContractMilestoneVM
    >({
      query: (body) => ({
        url: `/ContractMilestone`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ContractMilestone", id: "LIST" }],
    }),
  }),
});

export const {
  useGetContractMilestonesByContractQuery,
  useGetContractMilestoneStatusEnumsQuery,
  useGetContractMilestoneStatusFreelancerEnumsQuery,
  useGetContractMilestoneStatusEmployerEnumsQuery,
  useGetContractMilestoneStatusModeratorEnumsQuery,
  useUpdateContractMilestoneStatusFreelancerMutation,
  useUpdateContractMilestoneStatusEmployerMutation,
  useGetContractMilestoneByIdQuery,
  useUpdateContractMilestoneMutation,
  useDeleteContractMilestoneMutation,
  useCreateContractMilestoneMutation,
} = contractMilestonesApi;
