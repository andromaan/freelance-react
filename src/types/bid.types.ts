export interface BidVM {
  id: string;
  projectId: string;
  freelancerId: string;
  amount: number;
  message: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
}

export interface CreateBidVM {
  projectId: string;
  amount: number;
  message: string;
}
