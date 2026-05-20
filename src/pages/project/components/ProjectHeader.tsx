import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  status: string;
}

const ProjectHeader: React.FC<Props> = ({ status }) => {
  const navigate = useNavigate();
  const getStatusText = (s: string) => s.split(/(?=[A-Z])/).join(" ");

  return (
    <div className="flex items-center justify-between mb-2">
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
      >
        &larr; Back to Projects
      </button>
      <span className="text-sm font-bold tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        {getStatusText(status).toUpperCase()}
      </span>
    </div>
  );
};

export default ProjectHeader;
