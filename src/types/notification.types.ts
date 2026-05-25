import type { PagedVM } from "./pagination.types";

export const NotificationType = {
  NewBidReceived: 0,
  InterestedInYourBid: 1,
  NotInterestedInYourBid: 2,
  NewMessage: 3,
  MilestoneApproved: 4,
  MilestoneRejected: 5,
  ContractCreated: 6,
  PaymentReceived: 7,
  DisputeOpened: 8,
  ReviewLeft: 9,
  SystemAnnouncement: 10,
  ProjectDeadlineReminder: 11,
  NewQuoteReceived: 12,
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface NotificationVM {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  sentAt: string;
  userId: string | null;
  linkAddress?: string | null;
}

export interface NotificationPagedVM extends PagedVM {
  isRead?: boolean | null;
  notificationType?: number | null;
}
