import type React from "react";

// ─── Tab panels ───────────────────────────────────────────────────────────────
export const EditProfileTab: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
      <svg
        className="w-7 h-7 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </div>
    <p className="text-gray-600 dark:text-gray-300 font-medium">Edit Profile</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Coming soon</p>
  </div>
);
