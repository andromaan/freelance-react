export const ContractStatus = {
  Pending: 1,
  Active: 2,
  InProgress: 3,
  Completed: 4,
  Cancelled: 5,
  Disputed: 6,
  Refunded: 7
};

export type ContractStatus =
  (typeof ContractStatus)[keyof typeof ContractStatus];

export interface ContractVM {
  id: string;
  projectId: string;
  freelancerId: string;
  startDate: string;
  endDate?: string | null;
  agreedRate: number;
  status: string;
  employerUserId: string;
}

export interface ContractMilestoneVM {
  id: string;
  contractId: string;
  description?: string | null;
  amount: number;
  dueDate: string;
  status: string;
}