export interface BidVM {
  id: string;
  projectId: string;
  freelancerId: string;
  amount: number;
  message: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  isInteresting?: boolean;
}

export interface CreateBidVM {
  projectId: string;
  amount: number;
  message: string;
}

export interface UpdateBidVM {
  amount?: number;
  message: string;
}

export interface UpdateBidIsInterestVM {
  bidId: string;
  isInteresting: boolean;
}
