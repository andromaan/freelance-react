import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProjectStatus, type ProjectVM } from "../../../types/project.types";
import { getStatusText } from "../../../utils";
import DeleteIcon from "../../../components/icons/DeleteIcon";

interface Props {
  project: ProjectVM;
  onDelete?: (projectId: string) => void;
}

const ProjectCard: React.FC<Props> = ({ project, onDelete }) => {
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

  // const categoryName =
  //   project.categories.length > 0
  //     ? project.categories[0].name.toUpperCase()
  //     : "GENERAL";

  const deadlineDate = new Date(project.deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const deadline = new Date(project.deadline);
  const now = new Date();
  const diffInMs = deadline.getTime() - now.getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.ceil(Math.abs(diffInMs) / msPerDay);

  const isFuture = diffInMs >= 0;
  let dueDate = "";
  if (diffInDays < 31) {
    dueDate = `${diffInDays} day${diffInDays === 1 ? "" : "s"} ${isFuture ? "left" : "ago"}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    dueDate = `${months} month${months === 1 ? "" : "s"} ${isFuture ? "left" : "ago"}`;
  } else {
    const years = Math.floor(diffInDays / 365);
    dueDate = `${years} year${years === 1 ? "" : "s"} ${isFuture ? "left" : "ago"}`;
  }

  const dueSoon = isFuture && diffInDays <= 3;
  const dueClass = dueSoon ? "text-xs text-red-400" : "text-xs text-gray-400";

  const isInProgress = project.status === ProjectStatus.InProgress;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col justify-between border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {project.status !== ProjectStatus.Completed && (
              <span className={`${dueClass} flex items-center gap-1`}>
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Due {dueDate}
              </span>
            )}
          </div>

          {/* ── 3-dot menu ────────────────────────────────── */}
          {project.status === ProjectStatus.Open && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((p) => !p)}
                aria-label="Project actions"
                aria-expanded={menuOpen}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete?.(project.id);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <DeleteIcon className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {project.title}
        </h3>
      </div>

      <div className="flex gap-2 my-3">
        {(project.categories?.length > 2
          ? project.categories.slice(0, 2)
          : project.categories
        )?.map((c) => (
          <span
            key={c.id}
            className="text-[10px] font-bold tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          >
            {c.name}
          </span>
        ))}
        {project.categories?.length > 2 && (
          <span className="text-[10px] font-bold tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            ...
          </span>
        )}
      </div>

      <div>
        {project.status === ProjectStatus.Completed ? (
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
            <span className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
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
              Completed
            </span>
            <Link
              to={`/my-projects/${project.id}`}
              className="text-[10px] font-bold text-primary hover:opacity-80 uppercase tracking-wider transition-opacity inline-block"
            >
              Details
            </Link>
          </div>
        ) : (
          <>
            {isInProgress ? (
              <div className="flex items-end justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">
                        Status
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getStatusText(project.status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">
                        Deadline
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {deadlineDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/my-projects/${project.id}`}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors inline-block"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {getStatusText(project.status)}
                </span>
                <Link
                  to={`/my-projects/${project.id}`}
                  className="text-[10px] font-bold text-primary hover:opacity-80 uppercase tracking-wider transition-opacity inline-block"
                >
                  Details
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
