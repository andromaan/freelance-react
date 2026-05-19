import React from "react";
import type { ProjectVM } from "../../../types/project.types";

interface Props {
  project: ProjectVM;
}

const ProjectMeta: React.FC<Props> = ({ project }) => {
  const categories =
    project.categories?.length > 0
      ? project.categories
      : [{ id: "general", name: "GENERAL" }];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="inline-block text-[10px] font-bold tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {cat.name.toUpperCase()}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {project.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-3xl whitespace-pre-wrap">
            {project.description}
          </p>
        </div>

        <div className="flex-col shrink-0 flex gap-4 text-right">
          <div className="flex gap-2 justify-end">
            <button className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors flex gap-1">
              <svg
                className="w-3.5 h-3.5"
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
              Edit Project Fields
            </button>
          </div>
          <div className="shrink-0 flex gap-4 text-right">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                Budget
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${project.budget}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                Deadline
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(project.deadline).toLocaleDateString("uk-UA")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMeta;
