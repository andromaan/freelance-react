import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useGetChatDetailsQuery, useGetChatMessagesQuery } from "../../services/chat/chatApi";
import { useChatHub } from "../../hooks/useChatHub";
import { selectCurrentUser } from "../../store/userSlice";

const ContractChatPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const { data: chatDetails, isLoading: detailsLoading } = useGetChatDetailsQuery(contractId!);
  const { data: initialMessages = [], isLoading: messagesLoading } = useGetChatMessagesQuery(contractId!);

  const { messages, isConnected, sendMessage, editMessage, deleteMessage } = useChatHub(
    contractId!,
    initialMessages
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (detailsLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <span className="text-gray-500 dark:text-gray-400">Loading chat...</span>
      </div>
    );
  }

  if (!chatDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <span className="text-red-500">Chat details not found.</span>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const isChatActive = chatDetails.contractStatus === "Active" || chatDetails.contractStatus === "Pending";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isChatActive) return;

    if (editingMessageId) {
      await editMessage(editingMessageId, newMessage);
      setEditingMessageId(null);
    } else {
      await sendMessage(newMessage);
    }
    setNewMessage("");
  };

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col z-40">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 px-6 shadow-sm flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/contract/${contractId}`)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Back to Contract"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                {chatDetails.interlocutorName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                {chatDetails.projectTitle}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isConnected && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
              Disconnected
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
            isChatActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}>
            {chatDetails.contractStatus}
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`group relative max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                  isMine 
                    ? "bg-primary text-white rounded-br-none" 
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                }`}>
                  <p className="whitespace-pre-wrap break-words text-sm">{msg.text}</p>
                  <span className={`block text-[10px] mt-1 ${isMine ? "text-primary-100 text-right opacity-80" : "text-gray-500 dark:text-gray-400"}`}>
                    {format(new Date(msg.sentAt), "HH:mm")}
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
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
        {!isChatActive && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            You cannot send messages because the contract is {chatDetails.contractStatus}.
          </div>
        )}
        <form onSubmit={handleSend} className="max-w-5xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isChatActive || !isConnected}
            placeholder={
              !isChatActive 
                ? "Chat disabled" 
                : editingMessageId 
                  ? "Edit message..." 
                  : "Type your message..."
            }
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            disabled={!isChatActive || !isConnected || !newMessage.trim()}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm shadow-primary/30 flex items-center justify-center"
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
              className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition-all"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContractChatPage;
