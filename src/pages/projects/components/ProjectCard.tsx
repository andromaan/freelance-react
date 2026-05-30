import { Link } from "react-router-dom";
import type { ProjectVM } from "../../../types/project.types";

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dueLabel(iso: string): { text: string; urgent: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / 86_400_000);
  const urgent = diff >= 0 && days <= 3;
  if (diff < 0) return { text: `${Math.abs(days)}d ago`, urgent: false };
  if (days < 31) return { text: `${days}d left`, urgent };
  const months = Math.floor(days / 30);
  return { text: `${months}mo left`, urgent: false };
}

const ProjectCard: React.FC<{ project: ProjectVM }> = ({ project }) => {
  const due = dueLabel(project.deadline);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden h-full"
    >
      {/* Card header */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h2 className="text-base font-semibold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {(project.categories?.length > 4
            ? project.categories.slice(0, 4)
            : project.categories
          )?.map((c) => (
            <span
              key={c.id}
              className="text-[10px] px-2 py-0.5 rounded-full tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium"
            >
              {c.name}
            </span>
          ))}
          {project.categories?.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
              ...
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            ${project.budget.toLocaleString("en-US")}
          </span>
          <span
            className={`text-xs flex items-center gap-1 ${due.urgent ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatDeadline(project.deadline)} · {due.text}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
