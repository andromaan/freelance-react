import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ProjectStatus, type ProjectVM } from "../../../types/project.types";
import { getStatusText } from "../../../utils";

interface Props {
  projects: ProjectVM[];
  onDelete?: (projectId: string) => void;
}

const ProjectTableRow: React.FC<{
  project: ProjectVM;
  onDelete?: (id: string) => void;
}> = ({ project, onDelete }) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const deadlineDate = new Date(project.deadline).toLocaleDateString(
    document.documentElement.lang === "uk" ? "uk-UA" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-4 px-4 align-top">
        <Link
          to={`/my-projects/${project.id}`}
          className="font-semibold text-text-main hover:text-primary transition-colors block mb-1"
        >
          {project.title}
        </Link>
        <div className="flex gap-2 mt-2">
          {(project.categories?.length > 2
            ? project.categories.slice(0, 2)
            : project.categories
          )?.map((c) => (
            <span
              key={c.id}
              className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            >
              {c.name}
            </span>
          ))}
          {project.categories?.length > 2 && (
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              ...
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-4 align-top whitespace-nowrap text-sm text-text-muted">
        {deadlineDate}
      </td>
      <td className="py-4 px-4 align-top whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {getStatusText(project.status)}
        </span>
      </td>
      <td className="py-4 px-4 align-top whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-3">
          <Link
            to={`/my-projects/${project.id}`}
            className="text-primary hover:text-primary-hover font-medium transition-colors"
          >
            {t("projects.card.details")}
          </Link>

          {project.status === ProjectStatus.Open ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((p) => !p)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-surface border border-border rounded-xl shadow-lg py-1 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete?.(project.id);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {t("common.delete")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-7"></div>
          )}
        </div>
      </td>
    </tr>
  );
};

const ProjectTable: React.FC<Props> = ({ projects, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
              >
                {t("projects.table.project")}
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider"
              >
                {t("projects.table.deadline")}
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider"
              >
                {t("projects.table.status")}
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider w-32"
              >
                {t("projects.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-surface">
            {projects.map((project) => (
              <ProjectTableRow
                key={project.id}
                project={project}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
