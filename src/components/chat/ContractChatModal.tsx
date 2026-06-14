import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import {
  useGetChatDetailsQuery,
  useGetChatMessagesQuery,
} from "../../services/chat/chatApi";
import { useChatHub } from "../../hooks/useChatHub";
import { selectCurrentUser } from "../../store/userSlice";
import { Link } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { formatMessageDate, userImageUrl } from "../../utils";
import DeleteIcon from "../icons/DeleteIcon";
import { useVoiceInput } from "../../hooks/useVoiceInput";
import { useTranslation } from "react-i18next";
import ArrowIcon from "../icons/ArrowIcon";


interface ContractChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  contractId: string;
}

const ContractChatModal: React.FC<ContractChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  contractId,
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  // Accessibility refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  const handleTranscript = useCallback((text: string) => {
    setNewMessage((prev) => (prev ? prev + " " + text : text));
  }, []);

  const { i18n, t } = useTranslation();
  const voiceLang = i18n.language === "uk" ? "uk-UA" : "en-US";

  const {
    status: voiceStatus,
    interimText,
    toggle: toggleVoice,
  } = useVoiceInput({
    onTranscript: handleTranscript,
    lang: voiceLang,
  });

  const isListening = voiceStatus === "listening";
  const isVoiceBusy = voiceStatus === "loading" || voiceStatus === "processing";

  // Use skip to not fetch if modal is closed
  const {
    data: chatDetails,
    isLoading: detailsLoading,
    refetch: refetchDetails,
  } = useGetChatDetailsQuery(contractId, { skip: !isOpen });
  const {
    data: initialMessages = [],
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery(contractId, { skip: !isOpen });

  const {
    messages,
    isConnected,
    isConnecting,
    isInterlocutorOnline,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
  } = useChatHub(
    isOpen ? contractId : "",
    initialMessages,
    chatDetails?.interlocutorId,
    chatDetails?.isInterlocutorOnline,
  );

  const isChatActive =
    chatDetails?.contractStatus === "Active" ||
    chatDetails?.contractStatus === "Pending";

  const scrollToBottom = (offset = 32) => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight + offset - container.clientHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Autofocus: mic if available, otherwise textarea
      requestAnimationFrame(() => {
        if (micButtonRef.current && voiceStatus !== "unsupported") {
          micButtonRef.current.focus();
        } else {
          textareaRef.current?.focus();
        }
      });
    } else {
      // Return focus to open button when closing
      openButtonRef.current?.focus();
    }
  }, [messages, isOpen, isConnected]);

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

  // ── Keyboard: Escape closes, Tab stays inside ─────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape → close
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap — keep Tab inside the panel
      if (e.key === "Tab" && chatPanelRef.current) {
        const focusable = Array.from(
          chatPanelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null); // visible only

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return createPortal(
      <button
        ref={openButtonRef}
        onClick={onOpen}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onOpen(); } }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-xl hover:bg-primary-hover hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-primary/50 flex items-center justify-center"
        aria-label="Open chat"
        aria-haspopup="dialog"
        aria-expanded={false}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>,
      document.body,
    );
  }

  const linkToInterlocutor =
    chatDetails?.interlocutorRole === ROLES.FREELANCER
      ? `/freelancers/${chatDetails.interlocutorId}`
      : `/employers/${chatDetails?.interlocutorId}`;

  return createPortal(
    <div
      ref={chatPanelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-dialog-title"
      className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 flex flex-col w-full sm:w-[500px] h-[100dvh] sm:h-[600px] sm:max-h-[85vh] bg-surface sm:rounded-2xl shadow-2xl overflow-hidden border-0 sm:border border-border animate-in slide-in-from-bottom-8"
    >
      {detailsLoading || messagesLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-text-muted">{t("contracts.chat.loadingChat")}</span>
        </div>
      ) : !chatDetails ? (
        <div className="flex flex-col items-center justify-center p-12">
          <span className="text-red-500">{t("contracts.chat.chatNotFound")}</span>
          <button
            onClick={onClose}
            className="mt-4 text-primary hover:underline"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-surface border-b border-border p-2 px-3 shadow-sm flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Link
                  to={linkToInterlocutor}
                  className="flex items-center gap-3"
                >
                  {chatDetails.interlocutorAvatar ? (
                    <img
                      src={userImageUrl(chatDetails.interlocutorAvatar)}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {chatDetails.interlocutorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <div>
                  <div className="flex gap-3">
                    <Link
                  to={linkToInterlocutor}
                  className="text-xl font-bold text-text-main leading-tight flex items-center gap-3 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                >
                  <h2 id="chat-dialog-title">{chatDetails.interlocutorName}</h2>
                    </Link>
                    {isConnecting ? (
                      <span className="px-2 py-0.5 text-xs/[1.5] font-medium rounded-full text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-800/5 border border-blue-200 dark:border-blue-500/50 flex items-center gap-1">
                        <svg
                          className="w-3 h-3 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        {i18n.language === "uk"
                          ? "Підключення..."
                          : "Connecting..."}
                      </span>
                    ) : (
                      !isConnected && (
                        <span className="px-2 text-xs/[1.5] font-medium rounded-full text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                          Disconnected
                        </span>
                      )
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <span
                        className={
                          isInterlocutorOnline
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-text-muted"
                        }
                      >
                        {isInterlocutorOnline ? t("contracts.chat.online") : t("contracts.chat.offline")}
                      </span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                    <p
                      className="text-sm text-text-muted max-w-xs truncate"
                      title={chatDetails.projectTitle}
                    >
                      {t("contracts.chat.project")}: {chatDetails.projectTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:p-6 custom-scrollbar bg-main">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id;
                const isChatActive =
                  chatDetails.contractStatus === "Active" ||
                  chatDetails.contractStatus === "Pending";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    ref={messagesEndRef}
                  >
                    <div
                      className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                        isMine
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-surface border border-border text-text-main rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm">
                        {msg.text}
                      </p>
                      <span
                        className={`flex items-center gap-1.5 text-[10px] mt-1 ${isMine ? "text-primary-100 justify-end opacity-80" : "text-text-muted"}`}
                      >
                        <span>{formatMessageDate(msg.sentAt)}</span>
                        {msg.isEdited && (
                          <span
                            className="italic opacity-70"
                            title={
                              msg.modifiedAt
                                ? `${t("contracts.chat.edited")}: ${formatMessageDate(msg.modifiedAt)}`
                                : "Edited"
                            }
                          >
                            (edited)
                          </span>
                        )}
                        {isMine && <span>{msg.isRead ? "✓✓" : "✓"}</span>}
                      </span>

                      {isMine && isChatActive && (
                        <div className="absolute top-1 -left-14 flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingMessageId(msg.id);
                              setNewMessage(msg.text);
                            }}
                            className="p-1 text-gray-500 hover:text-primary transition-colors focus:outline-none"
                            aria-label="Edit message"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setMessageToDelete(msg.id)}
                            className="p-1 text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
                            aria-label="Delete message"
                          >
                            <DeleteIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="bg-surface p-2 border-t border-border shrink-0">
            {!isChatActive && (
              <div className="text-center text-sm text-text-muted mb-2">
                You cannot send messages because the contract is{" "}
                {chatDetails.contractStatus}.
              </div>
            )}
            {/* Interim voice text hint — covers native interim, whisper progress, processing */}
            {(isListening || isVoiceBusy) && interimText && (
              <div
                className={`px-3 py-1 mb-1 text-xs italic truncate ${
                  isVoiceBusy
                    ? "text-primary animate-pulse"
                    : "text-text-muted animate-pulse"
                }`}
              >
                {interimText}
              </div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newMessage.trim() || !isChatActive) return;

                if (editingMessageId) {
                  await editMessage(editingMessageId, newMessage);
                  setEditingMessageId(null);
                } else {
                  await sendMessage(newMessage);
                }
                setNewMessage("");
              }}
              className="flex gap-1 sm:gap-2 items-end"
            >
              {/* Mic button */}
              {voiceStatus !== "unsupported" && (
                <button
                  ref={micButtonRef}
                  type="button"
                  onClick={toggleVoice}
                  disabled={!isChatActive || !isConnected || isVoiceBusy}
                  title={
                    isListening
                      ? "Stop recording (Space)"
                      : isVoiceBusy
                        ? "Processing…"
                        : voiceStatus === "error"
                          ? "Error, try again"
                          : "Start voice input (Space)"
                  }
                  onKeyDown={(e) => {
                    // Space or Enter starts/stops recording
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      if (!isVoiceBusy) toggleVoice();
                    }
                    // Arrow right moves focus to textarea
                    if (e.key === "ArrowRight" || e.key === "Tab" && !e.shiftKey) {
                      e.preventDefault();
                      textareaRef.current?.focus();
                    }
                  }}
                  className={`shrink-0 p-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed ${
                    isListening
                      ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                      : isVoiceBusy
                        ? "bg-primary/10 border-primary text-primary"
                        : voiceStatus === "error"
                          ? "bg-orange-100 dark:bg-orange-900/30 border-orange-400 text-orange-500"
                          : "bg-gray-100 dark:bg-gray-700 border-border text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:border-primary hover:text-primary"
                  }`}
                  aria-label={
                    isListening ? "Stop voice recording" : "Start voice input"
                  }
                  aria-pressed={isListening}
                >
                  {isListening ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : isVoiceBusy ? (
                    /* Spinner */
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    /* Mic icon */
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M12 3a4 4 0 014 4v4a4 4 0 01-8 0V7a4 4 0 014-4z"
                      />
                    </svg>
                  )}
                </button>
              )}
              <textarea
                ref={textareaRef}
                id="chat-message-input"
                aria-label="Message input. Press Enter to send, Shift+Enter for new line"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!newMessage.trim() || !isChatActive || !isConnected)
                      return;

                    if (editingMessageId) {
                      await editMessage(editingMessageId, newMessage);
                      setEditingMessageId(null);
                    } else {
                      await sendMessage(newMessage);
                    }
                    setNewMessage("");
                  }
                }}
                disabled={!isChatActive || !isConnected}
                placeholder={
                  !isChatActive
                    ? t("contracts.chat.disabled")
                    : isListening
                      ? t("contracts.chat.listening")
                      : isVoiceBusy
                        ? t("contracts.chat.processing")
                        : editingMessageId
                          ? t("contracts.chat.editMessage")
                          : t("contracts.chat.typeMessage")
                }
                rows={1}
                style={
                  {
                    fieldSizing: "content",
                    minHeight: "1lh",
                    maxHeight: "10lh",
                  } as React.CSSProperties
                }
                className={`flex-1 px-3 py-2 rounded-xl border bg-gray-50 dark:bg-gray-700 text-xs sm:text-sm text-text-main placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all sm:text-base resize-none custom-scrollbar ${
                  isListening
                    ? "border-red-400 ring-2 ring-red-400/30"
                    : isVoiceBusy
                      ? "border-primary/50 ring-2 ring-primary/20"
                      : "border-border"
                }`}
              />
              <button
                type="submit"
                disabled={!isChatActive || !isConnected || !newMessage.trim()}
                className={`${editingMessageId ? "p-3" : "pr-2 pl-3"} py-2 bg-primary text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm shadow-primary/30 flex items-center justify-center`}
              >
                {editingMessageId ? (
                  t("common.save")
                ) : (
                  <div className="flex alight-center items-center">
                    {t("common.send")}
                    <ArrowIcon direction="right" />
                  </div>
                )}
              </button>
              {editingMessageId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMessageId(null);
                    setNewMessage("");
                  }}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition-all"
                >{t("common.cancel")}</button>
              )}
            </form>
          </div>
        </>
      )}

      {messageToDelete && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200 px-4">
          <div className="max-w-xs bg-surface rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 text-left align-middle border border-border">
            <div className="flex items-center justify-between p-3 border-b border-border-light">
              <h3 className="text-xl font-semibold text-text-main leading-none">{t("contracts.chat.deleteTitle")}</h3>
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md p-1 -mr-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-3">
              <p className="mb-3 text-sm leading-relaxed text-text-muted">{t("contracts.chat.deleteConfirm")}</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setMessageToDelete(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 border border-border hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-colors"
                >{t("common.cancel")}</button>
                <button
                  type="button"
                  onClick={() => {
                    deleteMessage(messageToDelete);
                    setMessageToDelete(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 min-w-[6rem] px-5 py-2 text-sm font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-150"
                >{t("common.delete")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
};

export default ContractChatModal;
