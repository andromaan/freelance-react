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
  [NotificationType.NewBidReceived]: "Нова заявка",
  [NotificationType.NewMessage]: "Нове повідомлення",
  [NotificationType.MilestoneApproved]: "Майлстон затверджено",
  [NotificationType.MilestoneRejected]: "Майлстон відхилено",
  [NotificationType.ContractCreated]: "Контракт створено",
  [NotificationType.PaymentReceived]: "Платіж отримано",
  [NotificationType.DisputeOpened]: "Спір відкрито",
  [NotificationType.ReviewLeft]: "Залишено відгук",
  [NotificationType.SystemAnnouncement]: "Оголошення системи",
  [NotificationType.ProjectDeadlineReminder]: "Нагадування про дедлайн",
};

export interface NotificationVM {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  sentAt: string;
  userId: string | null;
}
