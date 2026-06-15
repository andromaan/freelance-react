import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import {
  useGetContractMilestonesByContractQuery,
  useUpdateContractMilestoneStatusFreelancerMutation,
  useUpdateContractMilestoneStatusEmployerMutation,
} from "../../../services/contract-milestone/contractMilestoneApi";
import { ContractMilestoneStatusLabel } from "../../../types/contract-milestone.types";
import {
  ContractMilestoneEmployerStatus,
  ContractMilestoneFreelancerStatus,
} from "../../../types/contract-milestone.types";
import { getStatusText } from "../../../utils";
import { useDispatch } from "react-redux";
import { contractsApi } from "../../../services/contracts/contractsApi";

interface ContractMilestonesListProps {
  contractId: string;
  isFreelancer: boolean;
  isDisputed?: boolean;
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case ContractMilestoneStatusLabel.Pending:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case ContractMilestoneStatusLabel.InProgress:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case ContractMilestoneStatusLabel.Submitted:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case ContractMilestoneStatusLabel.UnderReview:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case ContractMilestoneStatusLabel.Approved:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case ContractMilestoneStatusLabel.Rejected:
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const ContractMilestonesList: React.FC<ContractMilestonesListProps> = ({
  contractId,
  isFreelancer,
  isDisputed = false,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    data: milestones,
    isLoading,
    error,
  } = useGetContractMilestonesByContractQuery(contractId);
  const [updateFreelancerStatus, { isLoading: isFreelancerUpdating }] =
    useUpdateContractMilestoneStatusFreelancerMutation();
  const [updateEmployerStatus, { isLoading: isEmployerUpdating }] =
    useUpdateContractMilestoneStatusEmployerMutation();

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    status: ContractMilestoneFreelancerStatus | ContractMilestoneEmployerStatus;
    role: "freelancer" | "employer";
  } | null>(null);

  const isUpdating = isFreelancerUpdating || isEmployerUpdating;

  const handleFreelancerUpdate = async (
    id: string,
    status: ContractMilestoneFreelancerStatus,
  ) => {
    try {
      await updateFreelancerStatus({ id, data: { status } }).unwrap();
      setConfirmAction(null);
    } catch (e) {
      console.error("Failed to update milestone status", e);
    }
  };

  const handleEmployerUpdate = async (
    id: string,
    status: ContractMilestoneEmployerStatus,
  ) => {
    try {
      await updateEmployerStatus({ id, data: { status } }).unwrap();
      
      if (status === ContractMilestoneEmployerStatus.Approved) {
        const otherUnapproved = milestones?.filter(
          (m) => m.id !== id && m.status !== ContractMilestoneStatusLabel.Approved
        );
        
        if (otherUnapproved?.length === 0) {
          dispatch(
            contractsApi.util.invalidateTags([
              { type: "Contract", id: contractId },
              { type: "Contract", id: "DETAIL" },
            ])
          );
        }
      }
      
      setConfirmAction(null);
    } catch (e) {
      console.error("Failed to update milestone status", e);
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.role === "freelancer") {
      handleFreelancerUpdate(
        confirmAction.id,
        confirmAction.status as ContractMilestoneFreelancerStatus
      );
    } else {
      handleEmployerUpdate(
        confirmAction.id,
        confirmAction.status as ContractMilestoneEmployerStatus
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !milestones) {
    return (
      <div className="text-sm text-red-500">{t("contracts.milestones.errorLoad")}</div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="text-sm text-text-muted">
        {t("contracts.milestones.notFound")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone, _index) => (
        <div
          key={milestone.id}
          className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(milestone.status)}`}
              >
                {getStatusText(milestone.status)}
              </span>
            </div>
            <p className="text-text-main font-medium mb-2">
              {milestone.description || t("contracts.milestones.noDescription")}
            </p>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-1">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>${milestone.amount}</span>
              </div>
              <div className="flex items-center gap-1">
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
                <span>{t("contracts.milestones.due")} {format(new Date(milestone.dueDate), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {isFreelancer ? (
              <>
                {milestone.status === ContractMilestoneStatusLabel.Pending && (
                  <button
                    disabled={isUpdating || isDisputed}
                    onClick={() =>
                      setConfirmAction({
                        id: milestone.id,
                        status: ContractMilestoneFreelancerStatus.InProgress,
                        role: "freelancer",
                      })
                    }
                    className="px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 border border-blue-200 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-800/50 dark:hover:bg-blue-900/50 rounded-lg transition-colors disabled:opacity-50"
                  >{t("contracts.milestones.startWork")}</button>
                )}
                {milestone.status === ContractMilestoneStatusLabel.InProgress && (
                  <button
                    disabled={isUpdating || isDisputed}
                    onClick={() =>
                      setConfirmAction({
                        id: milestone.id,
                        status: ContractMilestoneFreelancerStatus.Submitted,
                        role: "freelancer",
                      })
                    }
                    className="px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:hover:bg-yellow-900/50 rounded-lg transition-colors disabled:opacity-50"
                  >{t("contracts.milestones.submitWork")}</button>
                )}
              </>
            ) : (
              <>
                {milestone.status === ContractMilestoneStatusLabel.Submitted && (
                  <button
                    disabled={isUpdating || isDisputed}
                    onClick={() =>
                      setConfirmAction({
                        id: milestone.id,
                        status: ContractMilestoneEmployerStatus.UnderReview,
                        role: "employer",
                      })
                    }
                    className="px-4 py-2 text-sm font-medium text-purple-800 bg-purple-100 border border-purple-200 hover:bg-purple-200 dark:text-purple-300 dark:bg-purple-900/30 dark:border-purple-800/50 dark:hover:bg-purple-900/50 rounded-lg transition-colors disabled:opacity-50"
                  >{t("contracts.milestones.reviewWork")}</button>
                )}
                {(milestone.status === ContractMilestoneStatusLabel.UnderReview ||
                  milestone.status === ContractMilestoneStatusLabel.Submitted) && (
                  <button
                    disabled={isUpdating || isDisputed}
                    onClick={() =>
                      setConfirmAction({
                        id: milestone.id,
                        status: ContractMilestoneEmployerStatus.Approved,
                        role: "employer",
                      })
                    }
                    className="px-4 py-2 text-sm font-medium text-green-800 bg-green-100 border border-green-200 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:border-green-800/50 dark:hover:bg-green-900/50 rounded-lg transition-colors disabled:opacity-50"
                  >{t("contracts.milestones.approve")}</button>
                )}
                {(milestone.status === ContractMilestoneStatusLabel.UnderReview ||
                  milestone.status === ContractMilestoneStatusLabel.Submitted) && (
                  <button
                    disabled={isUpdating || isDisputed}
                    onClick={() =>
                      setConfirmAction({
                        id: milestone.id,
                        status: ContractMilestoneEmployerStatus.InProgress,
                        role: "employer",
                      })
                    }
                    className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >{t("contracts.milestones.requestRework")}</button>
                )}
              </>
            )}
          </div>
        </div>
      ))}

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={t("contracts.milestones.confirmTitle")}
        description={t("contracts.milestones.confirmDesc")}
        confirmLabel={t("contracts.milestones.confirmYes")}
        cancelLabel={t("common.cancel")}
        isLoading={isUpdating}
        variant="primary"
      />
    </div>
  );
};

export default ContractMilestonesList;
