export interface ChatDetailsVM {
  contractId: string;
  projectTitle: string;
  interlocutorId: string;
  interlocutorName: string;
  interlocutorAvatar: string | null;
  contractStatus: string;
}

export interface MessageVM {
  id: string;
  contractId: string;
  senderId: string;
  receiverId: string;
  text: string;
  sentAt: string;
}
