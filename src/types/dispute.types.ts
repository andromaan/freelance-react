export const DisputeStatusMap: Record<number, string> = {
  0: "Open",
  1: "UnderReview",
  2: "Resolved",
  3: "Rejected"
};

export type DisputeStatus = number;

export interface CreateDisputeVM {
  contractId: string;
  reason: string | null;
}

export interface DisputeVM {
  id: string;
  contractId: string;
  reason: string | null;
  status: DisputeStatus;
  createdAt: string;
  createdBy: string;
}

export interface DisputeVMListResult {
  items: DisputeVM[];
  totalCount: number;
}
