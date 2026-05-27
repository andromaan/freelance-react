import React from "react";
import type { NotificationVM } from "../../../../types/notification.types";
import { Link } from "react-router-dom";
import { getStatusText } from "../../../../utils";

type Props = {
  n: NotificationVM;
  isToggling: boolean;
  onToggle: (id: string, currentIsRead: boolean) => void;
  formatTime: (iso: string) => string;
};

const NotificationItem: React.FC<Props> = ({
  n,
  isToggling,
  onToggle,
  formatTime,
}) => {
  return (
    <div
      className={`group relative flex items-start items-center gap-4 p-4 rounded-xl border transition-all duration-300 notification-item-enter ${
        !n.isRead
          ? "bg-blue-50/60 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/50"
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
      } ${isToggling ? "opacity-60 scale-[0.99]" : "opacity-100 scale-100"}`}
    >
      {n.linkAddress && (
        <Link
          to={n.linkAddress}
          className={`flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline absolute top-2 right-4 ${
            !n.isRead
              ? "text-blue-500 dark:text-blue-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            transform="scale(0.85)"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          Check it
          <svg
            className="w-4 h-4"
            transform="scale(-1,1)"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      )}

      <div className="mt-1.5 flex-shrink-0">
        <span
          className={`block w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            !n.isRead ? "bg-primary" : "bg-gray-200 dark:bg-gray-600"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-semibold text-blue-400 ${
              !n.isRead
                ? "text-blue-500 dark:text-blue-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {getStatusText(n.type)}
          </span>

          <span
            className={`text-xs text-gray-400 dark:text-gray-500 
              ${!n.isRead ? "text-gray-500 dark:text-gray-100" : "text-gray-600 dark:text-gray-100/60 "}`}
          >
            {formatTime(n.sentAt)}
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          {n.message}
        </p>
      </div>

      <button
        onClick={() => onToggle(n.id, n.isRead)}
        disabled={isToggling}
        title={n.isRead ? "Mark as unread" : "Mark as read"}
        className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed ${
          n.isRead
            ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            : "text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
        } ${n.linkAddress && "mt-3"}`}
      >
        {isToggling ? (
          <svg
            className="w-4 h-4 animate-spin text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : n.isRead ? (
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
              d="M3 19V8.5L12 3l9 5.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8.5l9 5.5 9-5.5"
            />
          </svg>
        ) : (
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
        )}
      </button>
    </div>
  );
};

export default NotificationItem;
