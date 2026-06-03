import React from "react";
import type { NotificationVM } from "../../../../types/notification.types";
import NotificationItem from "../Item/NotificationItem";

type Props = {
  notifications: NotificationVM[];
  isFetching: boolean;
  isLoading: boolean;
  togglingIds: Set<string>;
  onToggle: (id: string, currentIsRead: boolean) => void;
  formatTime: (iso: string) => string;
};

const NotificationsList: React.FC<Props> = ({
  notifications,
  isFetching,
  isLoading,
  togglingIds,
  onToggle,
  formatTime,
}) => {
  return (
    <div className="relative space-y-2">
      {isFetching && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-start justify-center pt-6 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm border border-border-light">
            <svg
              className="w-3.5 h-3.5 animate-spin text-primary"
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
            <span className="text-xs text-text-muted">
              Оновлення…
            </span>
          </div>
        </div>
      )}

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 notification-empty-enter">
          <svg
            className="w-14 h-14 mb-3 opacity-30"
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
          <p className="text-base">Сповіщень не знайдено</p>
        </div>
      ) : (
        <div
          className={`space-y-2 transition-opacity duration-200 ${isFetching ? "opacity-50" : "opacity-100"}`}
        >
          {notifications.map((n, _) => {
            const isToggling = togglingIds.has(n.id);
            return (
              <NotificationItem
                key={n.id}
                n={n}
                isToggling={isToggling}
                onToggle={onToggle}
                formatTime={formatTime}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
