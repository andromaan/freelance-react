export interface ReviewVM {
  id: string;
  contractId: string;
  reviewedUserId: string;
  rating: number;
  reviewText?: string | null;
  reviewerRoleId: number;
  reviewerId: string;
}
