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
