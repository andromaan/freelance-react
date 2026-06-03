import { format } from "date-fns";
import React from "react";
import type { ContractVM } from "../../../types/contract.types";
import { useGetProjectByIdQuery } from "../../../services/projects/projectsApi";

import { useNavigate } from "react-router-dom";
import ArrowIcon from "../../../components/icons/ArrowIcon";

interface ContractCardProps {
  contract: ContractVM;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const navigate = useNavigate();

  const formattedStartDate = contract.startDate
    ? format(new Date(contract.startDate), "MMM d, yyyy")
    : "N/A";

  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(
    contract.projectId,
  );

  return (
    <div
      className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-md cursor-pointer hover:border-primary/30"
      onClick={() => navigate(`/contract/${contract.id}`)}
    >
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 min-w-0">
              <span className="shrink-0">Contract for:</span>

              {isProjectLoading ? (
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
                </span>
              ) : (
                <span className="truncate" title={project?.title || undefined}>
                  {project?.title || "Project not found"}
                </span>
              )}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              ${contract.agreedRate}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-1.5">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Started: {formattedStartDate}</span>
            </div>
            {contract.endDate && (
              <div className="flex items-center gap-1.5">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Ended: {format(new Date(contract.endDate), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto text-primary text-sm font-medium">
          View Contract{" "}
          <ArrowIcon direction="right" />
        </div>
      </div>
    </div>
  );
};

export default ContractCard;
