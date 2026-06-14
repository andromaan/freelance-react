import React from "react";
import { useNavigate } from "react-router-dom";
import { getStatusText } from "../../../utils";
import ArrowIcon from "../../../components/icons/ArrowIcon";

interface Props {
  status: string;
}

const ProjectHeader: React.FC<Props> = ({ status }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-2">
      <button
        onClick={() => navigate("/my-projects")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowIcon direction="left" />
        Back to Projects
      </button>
      <span className="text-sm font-bold tracking-wider px-3 py-1 rounded-full bg-primary/5 text-primary dark:text-white border border-primary/50 dark:border-white/30">
        {getStatusText(status).toUpperCase()}
      </span>
    </div>
  );
};

export default ProjectHeader;
