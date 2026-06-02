export interface ChatDetailsVM {
  contractId: string;
  projectTitle: string;
  interlocutorId: string;
  interlocutorName: string;
  interlocutorAvatar: string | null;
  contractStatus: string;
  isInterlocutorOnline?: boolean;
  interlocutorRole: string
}

export interface MessageVM {
  id: string;
  contractId: string;
  senderId: string;
  receiverId: string;
  text: string;
  sentAt: string;
  isRead?: boolean;
}
