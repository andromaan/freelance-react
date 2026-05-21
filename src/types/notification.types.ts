import type { PagedVM } from "./pagination.types";

export const NotificationType = {
  NewBidReceived: 0,
  InterestedInYourBid: 1,
  NotInterestedInYourBid: 2,
  NewMessage: 4,
  MilestoneApproved: 5,
  MilestoneRejected: 6,
  ContractCreated: 7,
  PaymentReceived: 8,
  DisputeOpened: 9,
  ReviewLeft: 10,
  SystemAnnouncement: 11,
  ProjectDeadlineReminder: 12,
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.NewBidReceived]: "New Bid Received",
  [NotificationType.InterestedInYourBid]: "Interested in Your Bid",
  [NotificationType.NotInterestedInYourBid]: "Not Interested in Your Bid",
  [NotificationType.NewMessage]: "New Message",
  [NotificationType.MilestoneApproved]: "Milestone Approved",
  [NotificationType.MilestoneRejected]: "Milestone Rejected",
  [NotificationType.ContractCreated]: "Contract Created",
  [NotificationType.PaymentReceived]: "Payment Received",
  [NotificationType.DisputeOpened]: "Dispute Opened",
  [NotificationType.ReviewLeft]: "Review Left",
  [NotificationType.SystemAnnouncement]: "System Announcement",
  [NotificationType.ProjectDeadlineReminder]: "Project Deadline Reminder",
};

export interface NotificationVM {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  sentAt: string;
  userId: string | null;
  linkAddress?: string | null;
}

export interface NotificationPagedVM extends PagedVM {
  isRead?: boolean | null;
  notificationType?: number | null;
}
