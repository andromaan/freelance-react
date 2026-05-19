import React from "react";
import { Link } from "react-router-dom";

interface Props {
  projectId: string;
  bidsCount: number;
  quotesCount: number;
}

const ProjectResponses: React.FC<Props> = ({
  projectId,
  bidsCount,
  quotesCount,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider text-center">
          Responses
        </h3>
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700 text-center">
        <Link
          to={`/my-projects/${projectId}/bids`}
          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
        >
          <span className="block text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
            {bidsCount}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-widest">
            Bids
          </span>
        </Link>

        <Link
          to={`/my-projects/${projectId}/quotes`}
          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
        >
          <span className="block text-3xl font-bold text-green-500 mb-1 group-hover:scale-110 transition-transform">
            {quotesCount}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-widest">
            Quotes
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ProjectResponses;
