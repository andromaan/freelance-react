import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { createPortal } from "react-dom";
import { useGetChatDetailsQuery, useGetChatMessagesQuery } from "../../services/chat/chatApi";
import { useChatHub } from "../../hooks/useChatHub";
import { selectCurrentUser } from "../../store/userSlice";

interface ContractChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  contractId: string;
}

const ContractChatModal: React.FC<ContractChatWidgetProps> = ({ isOpen, onClose, onOpen, contractId }) => {
  const currentUser = useSelector(selectCurrentUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // Use skip to not fetch if modal is closed
  const { data: chatDetails, isLoading: detailsLoading, refetch: refetchDetails } = useGetChatDetailsQuery(contractId, { skip: !isOpen });
  const { data: initialMessages = [], isLoading: messagesLoading, refetch: refetchMessages } = useGetChatMessagesQuery(contractId, { skip: !isOpen });

  const { messages, isConnected, isInterlocutorOnline, sendMessage, editMessage, deleteMessage, markAsRead } = useChatHub(
    isOpen ? contractId : "",
    initialMessages,
    chatDetails?.interlocutorId,
    chatDetails?.isInterlocutorOnline
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Force fetch fresh data when chat opens so we get correct online status
  useEffect(() => {
    if (isOpen) {
      refetchDetails();
      refetchMessages();
    }
  }, [isOpen, refetchDetails, refetchMessages]);

  // Mark unread messages as read when chat is open and connected
  useEffect(() => {
    if (isOpen && isConnected && currentUser) {
      messages.forEach((msg) => {
        if (!msg.isRead && msg.senderId !== currentUser.id) {
          markAsRead(msg.id);
        }
      });
    }
  }, [isOpen, isConnected, messages, currentUser, markAsRead]);

  if (!isOpen) {
    return createPortal(
      <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-xl hover:bg-primary-hover hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center"
        aria-label="Open Chat"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[90vw] sm:w-[500px] h-[600px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700/60 animate-in slide-in-from-bottom-8">
      {(detailsLoading || messagesLoading) ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">Loading chat...</span>
          </div>
        ) : !chatDetails ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-red-500">Chat details not found.</span>
            <button onClick={onClose} className="mt-4 text-primary hover:underline">Close</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 px-3 shadow-sm flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {chatDetails.interlocutorAvatar ? (
                    <img
                      src={chatDetails.interlocutorAvatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {chatDetails.interlocutorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                      {chatDetails.interlocutorName}
                      <span className="flex items-center gap-1 text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${isInterlocutorOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {isInterlocutorOnline ? 'Online' : 'Offline'}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={chatDetails.projectTitle}>
                      {chatDetails.projectTitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isConnected && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full hidden sm:inline-block">
                    Disconnected
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                  aria-label="Close Chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-gray-50 dark:bg-gray-900/50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id;
                  const isChatActive = chatDetails.contractStatus === "Active" || chatDetails.contractStatus === "Pending";
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                        isMine 
                          ? "bg-primary text-white rounded-br-none" 
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                      }`}>
                        <p className="whitespace-pre-wrap break-words text-sm">{msg.text}</p>
                        <span className={`flex items-center gap-1 text-[10px] mt-1 ${isMine ? "text-primary-100 justify-end opacity-80" : "text-gray-500 dark:text-gray-400"}`}>
                          {format(new Date(msg.sentAt), "HH:mm")}
                          {isMine && (
                            <span>{msg.isRead ? '✓✓' : '✓'}</span>
                          )}
                        </span>
                        
                        {isMine && isChatActive && (
                          <div className="absolute top-1 -left-16 flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingMessageId(msg.id);
                                setNewMessage(msg.text);
                              }}
                              className="p-1 text-gray-500 hover:text-primary transition-colors focus:outline-none"
                              aria-label="Edit message"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="p-1 text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
                              aria-label="Delete message"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-700 shrink-0">
              {!(chatDetails.contractStatus === "Active" || chatDetails.contractStatus === "Pending") && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  You cannot send messages because the contract is {chatDetails.contractStatus}.
                </div>
              )}
              <form onSubmit={async (e) => {
                e.preventDefault();
                const isChatActive = chatDetails.contractStatus === "Active" || chatDetails.contractStatus === "Pending";
                if (!newMessage.trim() || !isChatActive) return;

                if (editingMessageId) {
                  await editMessage(editingMessageId, newMessage);
                  setEditingMessageId(null);
                } else {
                  await sendMessage(newMessage);
                }
                setNewMessage("");
              }} className="flex gap-1 sm:gap-3 items-end align-center items-center">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const isChatActive = chatDetails.contractStatus === "Active" || chatDetails.contractStatus === "Pending";
                      if (!newMessage.trim() || !isChatActive || !isConnected) return;
                      
                      if (editingMessageId) {
                        await editMessage(editingMessageId, newMessage);
                        setEditingMessageId(null);
                      } else {
                        await sendMessage(newMessage);
                      }
                      setNewMessage("");
                    }
                  }}
                  disabled={!(chatDetails.contractStatus === "Active" || chatDetails.contractStatus === "Pending") || !isConnected}
                  placeholder={
                    !(chatDetails.contractStatus === "Active" || chatDetails.contractStatus === "Pending")
                      ? "Chat disabled" 
                      : editingMessageId 
                        ? "Edit message..." 
                        : "Type your message..."
                  }
                  style={{
                    fieldSizing: "content",
                    minHeight: "1lh",
                    maxHeight: "10lh",

                  } as React.CSSProperties}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm sm:text-base resize-none custom-scrollbar"
                />
                <button
                  type="submit"
                  disabled={!(chatDetails.contractStatus === "Active" || chatDetails.contractStatus === "Pending") || !isConnected || !newMessage.trim()}
                  className="px-4 sm:px-6 py-2 bg-primary text-white text-xs sm:text-base font-medium rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm shadow-primary/30 flex items-center justify-center"
                >
                  {editingMessageId ? "Save" : "Send"}
                </button>
                {editingMessageId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMessageId(null);
                      setNewMessage("");
                    }}
                    className="px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-base font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition-all"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </>
        )}
      </div>,
    document.body
  );
};

export default ContractChatModal;