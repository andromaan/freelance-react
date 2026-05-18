import React from "react";

type Props = {
  readingAll: boolean;
  onReadAll: () => void;
};

const NotificationsHeader: React.FC<Props> = ({ readingAll, onReadAll }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Сповіщення
      </h1>
      <button
        onClick={onReadAll}
        disabled={readingAll}
        className="relative text-sm text-primary hover:underline disabled:opacity-50 flex items-center gap-2"
      >
        {readingAll && (
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
        )}
        Позначити всі прочитаними
      </button>
    </div>
  );
};

export default NotificationsHeader;
