import React from "react";

const Header: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 transition-colors">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
          My Projects
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl text-sm leading-relaxed transition-colors">
          Manage your active atelier engagements, track milestones, and maintain
          surgical precision over your delivery pipeline.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg text-sm font-medium">
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter & Sort
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 dark:hover:opacity-90 transition-colors text-sm font-medium">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Project
        </button>
      </div>
    </div>
  );
};

export default Header;
