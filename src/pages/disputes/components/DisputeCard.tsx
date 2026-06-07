import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { DisputeStatusMap } from "../../../types/dispute.types";
import type { DisputeVM } from "../../../types/dispute.types";
import { useTranslation } from "react-i18next";
import ArrowIcon from "../../../components/icons/ArrowIcon";

interface DisputeCardProps {
  dispute: DisputeVM;
}

const DisputeCard: React.FC<DisputeCardProps> = ({ dispute }) => {
  const { t } = useTranslation();

  const getStatusColor = (statusNum: number) => {
    const status = DisputeStatusMap[statusNum] || "";
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800";
      case "UnderReview":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 border-blue-200 dark:border-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 border-green-200 dark:border-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-border";
    }
  };

  const formattedDate = format(new Date(dispute.createdAt), "MMM d, yyyy");

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start gap-4">
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
              dispute.status
            )}`}
          >
            {DisputeStatusMap[dispute.status] || dispute.status}
          </span>
          <p className="mt-2 text-sm text-text-muted">
            {t("disputes.openedOn", "Opened on")}: {formattedDate}
          </p>
        </div>
        <Link
          to={`/contract/${dispute.contractId}`}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary-hover bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
        >
          {t("disputes.viewContract", "View Contract")}
          <ArrowIcon direction="right" />
        </Link>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-border mt-2">
        <h4 className="text-sm font-medium text-text-main mb-1">
          {t("disputes.reason", "Reason:")}
        </h4>
        <p className="text-sm text-text-muted break-words whitespace-pre-wrap">
          {dispute.reason || t("disputes.noReasonProvided", "No reason provided.")}
        </p>
      </div>
    </div>
  );
};

export default DisputeCard;
