import type React from "react";

export const MyQuotesTab: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <svg
        className="w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z"
        />
      </svg>
    </div>
    <p className="text-gray-600 dark:text-gray-300 font-medium">My Quotes</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Coming soon</p>
  </div>
);
