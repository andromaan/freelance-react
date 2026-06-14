import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import type { ContractVM } from "../../../types/contract.types";
import { useGetProjectByIdQuery } from "../../../services/projects/projectsApi";
import { useGetIsReviewedQuery } from "../../../services/reviews/reviewsApi";

import { useNavigate } from "react-router-dom";
import ArrowIcon from "../../../components/icons/ArrowIcon";

interface ContractCardProps {
  contract: ContractVM;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formattedStartDate = contract.startDate
    ? format(new Date(contract.startDate), "MMM d, yyyy")
    : "N/A";

  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(
    contract.projectId,
  );

  const { data: reviewedData } = useGetIsReviewedQuery(contract.id, {
    skip: contract.status !== "Completed",
  });

  return (
    <div
      className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-md cursor-pointer hover:border-primary/30"
      onClick={() => navigate(`/contract/${contract.id}`)}
    >
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 min-w-0">
              <span className="shrink-0">{t("contracts.card.contractFor")}</span>

              {isProjectLoading ? (
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
                </span>
              ) : (
                <span className="truncate" title={project?.title || undefined}>
                  {project?.title || t("contracts.card.projectNotFound")}
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
              <span>{t("contracts.card.started")} {formattedStartDate}</span>
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
                <span>{t("contracts.card.ended")} {format(new Date(contract.endDate), "MMM d, yyyy")}</span>
              </div>
            )}
            {contract.status === "Completed" && reviewedData && (
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 font-medium sm:ml-2 sm:border-l sm:border-border sm:pl-4">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {reviewedData.rating}
                <span className="text-xs text-text-muted ml-1 hidden sm:inline">{t("contracts.card.reviewed")}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto text-primary text-sm font-medium">
          {t("contracts.card.viewContract")}{" "}
          <ArrowIcon direction="right" />
        </div>
      </div>
    </div>
  );
};

export default ContractCard;
