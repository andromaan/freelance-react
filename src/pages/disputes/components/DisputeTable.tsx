import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { DisputeVM } from "../../../types/dispute.types";
import { DisputeStatusMap } from "../../../types/dispute.types";
import ArrowIcon from "../../../components/icons/ArrowIcon";

interface Props {
  disputes: DisputeVM[];
}

const DisputeTableRow: React.FC<{ dispute: DisputeVM }> = ({ dispute }) => {
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
  const stringStatus = DisputeStatusMap[dispute.status] || dispute.status;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-4 px-4 align-top text-sm text-text-main max-w-sm truncate" title={dispute.reason || t("disputes.noReasonProvided", "No reason provided.")}>
        {dispute.reason || <span className="text-text-muted italic">{t("disputes.noReasonProvided", "No reason provided.")}</span>}
      </td>
      <td className="py-4 px-4 align-top whitespace-nowrap text-sm text-text-muted text-center">
        {formattedDate}
      </td>
      <td className="py-4 px-4 align-top whitespace-nowrap text-center">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(dispute.status)}`}>
          {stringStatus}
        </span>
      </td>
      <td className="py-4 px-4 align-top whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-3">
          <Link
            to={`/contract/${dispute.contractId}`}
            className="text-primary hover:text-primary-hover font-medium transition-colors inline-flex items-center gap-1"
          >
            {t("disputes.viewContract", "View Contract")}
            <ArrowIcon direction="right" />
          </Link>
        </div>
      </td>
    </tr>
  );
};

const DisputeTable: React.FC<Props> = ({ disputes }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("disputes.reasonColumn", "Reason")}
              </th>
              <th scope="col" className="py-3 px-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("disputes.dateColumn", "Date Opened")}
              </th>
              <th scope="col" className="py-3 px-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("disputes.statusColumn", "Status")}
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider w-32">
                {t("disputes.actionsColumn", "Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-surface">
            {disputes.map((dispute) => (
              <DisputeTableRow key={dispute.id} dispute={dispute} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisputeTable;
