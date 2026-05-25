import type { ApiResponse } from "./response.types";

export interface ContractMilestoneVM {
  id: string;
  contractId: string;
  description: string | null;
  amount: number;
  dueDate: string;
  status: string;
}

export interface CreateContractMilestoneVM {
  contractId: string;
  description: string | null;
  amount: number;
  dueDate: string;
}

export interface UpdateContractMilestoneVM {
  description: string | null;
  amount: number;
  dueDate: string;
}

export interface UpdContractMilestoneStatusFreelancerVM {
  status: ContractMilestoneFreelancerStatus;
}

export interface UpdContractMilestoneStatusEmployerVM {
  status: ContractMilestoneEmployerStatus;
}

export interface UpdContractMilestoneStatusModeratorVM {
  status: ContractMilestoneStatus;
}

export type ContractMilestoneVMListServiceResponse = ApiResponse<
  ContractMilestoneVM[]
>;
export type ContractMilestoneVMServiceResponse =
  ApiResponse<ContractMilestoneVM>;

export const ContractMilestoneStatus = {
  Pending: 0,
  InProgress: 1,
  Submitted: 2,
  UnderReview: 3,
  Approved: 4,
  Rejected: 5,
} as const;

export type ContractMilestoneStatus =
  (typeof ContractMilestoneStatus)[keyof typeof ContractMilestoneStatus];

export const ContractMilestoneStatusLabel = {
  Pending: 'Pending',
  InProgress: 'InProgress',
  Submitted: 'Submitted',
  UnderReview: 'UnderReview',
  Approved: 'Approved',
  Rejected: 'Rejected',
} as const;

export type ContractMilestoneStatusLabel =
  (typeof ContractMilestoneStatusLabel)[keyof typeof ContractMilestoneStatusLabel];

export const ContractMilestoneFreelancerStatus = {
  InProgress: ContractMilestoneStatus.InProgress,
  Submitted: ContractMilestoneStatus.Submitted,
} as const;

export type ContractMilestoneFreelancerStatus =
  (typeof ContractMilestoneFreelancerStatus)[keyof typeof ContractMilestoneFreelancerStatus];

export const ContractMilestoneEmployerStatus = {
  InProgress: ContractMilestoneStatus.InProgress,
  UnderReview: ContractMilestoneStatus.UnderReview,
  Approved: ContractMilestoneStatus.Approved,
} as const;

export type ContractMilestoneEmployerStatus =
  (typeof ContractMilestoneEmployerStatus)[keyof typeof ContractMilestoneEmployerStatus];
