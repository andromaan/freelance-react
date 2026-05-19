import React from "react";
import type { MilestoneVM } from "../../../types/project.types";

interface Props {
  milestones: MilestoneVM[];
}

const ProjectMilestones: React.FC<Props> = ({ milestones }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Project Milestones
        </h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1">
            <span>+</span> Add Milestone
          </button>
        </div>
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No milestones have been added to this project yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="flex justify-between items-center p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
            >
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {m.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {m.description}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-gray-900 dark:text-white">
                  ${m.amount}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectMilestones;
