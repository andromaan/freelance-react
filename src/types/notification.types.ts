import type { PagedVM } from "./pagination.types";

export const NotificationType = {
  NewBidReceived: 0,
  InterestedInYourBid: 1,
  NotInterestedInYourBid: 2,
  NewMessage: 3,
  MilestoneStatusUpdated: 4,
  ContractCreated: 5,
  PaymentReceived: 6,
  DisputeOpened: 7,
  ReviewLeft: 8,
  SystemAnnouncement: 9,
  ProjectDeadlineReminder: 10,
  NewQuoteReceived: 11,
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
