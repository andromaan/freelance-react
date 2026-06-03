import React from "react";
import { ProjectStatus } from "../../../types/project.types";

type Props = {
  activeTab: ProjectStatus | null;
  onTabChange: (status: ProjectStatus | null) => void;
  counts: Record<string, number>;
};

const Tabs: React.FC<Props> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { label: "All Projects", value: null },
    { label: "Open", value: ProjectStatus.Open },
    { label: "In Progress", value: ProjectStatus.InProgress },
    { label: "Completed", value: ProjectStatus.Completed },
    { label: "Cancelled", value: ProjectStatus.Cancelled },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-border mb-8 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const countKey = tab.value === null ? "all" : tab.value;
        return (
          <button
            key={tab.label}
            onClick={() => onTabChange(tab.value)}
            className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isActive
                  ? "bg-blue-100 text-blue-600 dark:bg-primary/20 dark:text-primary"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800"
              }`}
            >
              {counts[countKey] || 0}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
