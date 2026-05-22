export interface QuoteVM {
  id: string;
  projectId: string;
  freelancerId: string;
  amount: number;
  message: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
}

export interface CreateQuoteVM {
  projectId: string;
  amount: number;
  message: string;
}
