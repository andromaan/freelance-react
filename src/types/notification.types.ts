export const NotificationType = {
  NewBidReceived: 0,
  NewMessage: 1,
  MilestoneApproved: 2,
  MilestoneRejected: 3,
  ContractCreated: 4,
  PaymentReceived: 5,
  DisputeOpened: 6,
  ReviewLeft: 7,
  SystemAnnouncement: 8,
  ProjectDeadlineReminder: 9,
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.NewBidReceived]: "New Bid Received",
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
}
