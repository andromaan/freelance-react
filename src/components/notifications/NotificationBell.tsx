import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNotifications,
  selectUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../../store/notificationSlice";
import type { AppDispatch } from "../../store";
import {
  useToggleIsReadMutation,
  useReadAllMutation,
} from "../../services/notification/notificationApi";
import { Link } from "react-router-dom";
import { getStatusText } from "../../utils";

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hours ago`;
  return date.toLocaleDateString("uk-UA");
};

const NotificationBell: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [open, setOpen] = useState(false);
  const [leavingIds, setLeavingIds] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const [toggleIsRead, { isLoading: toggling }] = useToggleIsReadMutation();
  const [readAll, { isLoading: readingAll }] = useReadAllMutation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => setOpen((v) => !v);

  const handleMarkAll = async () => {
    if (readingAll) return;
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    setLeavingIds(new Set(unreadIds));
    setTimeout(async () => {
      try {
        await readAll().unwrap();
      } finally {
        dispatch(markAllAsRead());
        setLeavingIds(new Set());
      }
    }, 300);
  };

  const handleMarkAsRead = async (id: string) => {
    if (toggling || leavingIds.has(id)) return;
    setLeavingIds((prev) => new Set(prev).add(id));
    setTimeout(async () => {
      try {
        await toggleIsRead(id).unwrap();
      } finally {
        dispatch(markAsRead(id));
        setLeavingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }, 300);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-blue-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                <svg
                  className="w-10 h-10 mb-2 opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => {
                const isLeaving = leavingIds.has(n.id);
                return (
                  <div
                    key={n.id}
                    className={`group relative border-b border-gray-50 dark:border-gray-700/50 last:border-0 overflow-hidden transition-all duration-300 ease-in-out ${
                      isLeaving
                        ? "opacity-0 max-h-0 py-0"
                        : `opacity-100 max-h-40 ${!n.isRead ? "bg-blue-50/60 dark:bg-blue-900/10" : ""}`
                    }`}
                  >
                    <div className="flex items-start gap-3 px-4 py-3">
                      <Link to="/notifications" onClick={() => setOpen(false)}>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-primary mb-0.5">
                            {getStatusText(n.type)}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatTime(n.sentAt)}
                          </p>
                        </div>
                      </Link>
                      {/* Mark as read button — shown only for unread */}
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          aria-label="Mark as read"
                          title="Mark as read"
                          className="flex-shrink-0 mt-0.5 p-1 rounded-md text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors opacity-0 group-hover:opacity-100"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs text-blue-400 hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
