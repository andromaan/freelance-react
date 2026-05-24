import React from "react";
import { format } from "date-fns";
import {
  useGetContractMilestonesQuery,
  useUpdateContractMilestoneFreelancerMutation,
  useUpdateContractMilestoneEmployerMutation,
} from "../../../services/contracts/contractsApi";
import { ContractMilestoneStatusLabel } from "../../../types/contract-milestone.types";
import {
  ContractMilestoneEmployerStatus,
  ContractMilestoneFreelancerStatus,
} from "../../../types/contract-milestone.types";

interface ContractMilestonesListProps {
  contractId: string;
  isFreelancer: boolean;
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

const getStatusLabel = (status: string) => {
  return status.split(/(?=[A-Z])/).join(" ");
};

const ContractMilestonesList: React.FC<ContractMilestonesListProps> = ({
  contractId,
  isFreelancer,
}) => {
  const {
    data: milestones,
    isLoading,
    error,
  } = useGetContractMilestonesQuery(contractId);
  const [updateFreelancerStatus, { isLoading: isFreelancerUpdating }] =
    useUpdateContractMilestoneFreelancerMutation();
  const [updateEmployerStatus, { isLoading: isEmployerUpdating }] =
    useUpdateContractMilestoneEmployerMutation();

  const isUpdating = isFreelancerUpdating || isEmployerUpdating;

  const handleFreelancerUpdate = async (
    id: string,
    status: ContractMilestoneFreelancerStatus,
  ) => {
    try {
      await updateFreelancerStatus({ id, statusVM: { status } }).unwrap();
    } catch (e) {
      console.error("Failed to update milestone status", e);
    }
  };

  const handleEmployerUpdate = async (
    id: string,
    status: ContractMilestoneEmployerStatus,
  ) => {
    try {
      await updateEmployerStatus({ id, statusVM: { status } }).unwrap();
    } catch (e) {
      console.error("Failed to update milestone status", e);
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
      <div className="text-sm text-red-500">Failed to load milestones.</div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No milestones found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => (
        <div
          key={milestone.id}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Phase {index + 1}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(milestone.status)}`}
              >
                {getStatusLabel(milestone.status)}
              </span>
            </div>
            <p className="text-gray-900 dark:text-white font-medium mb-2">
              {milestone.description || "No description provided."}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                <span>
                  Due: {format(new Date(milestone.dueDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {isFreelancer ? (
              <>
                {milestone.status === ContractMilestoneStatusLabel.Pending && (
                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handleFreelancerUpdate(
                        milestone.id,
                        ContractMilestoneFreelancerStatus.InProgress,
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Start Work
                  </button>
                )}
                {milestone.status === ContractMilestoneStatusLabel.InProgress && (
                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handleFreelancerUpdate(
                        milestone.id,
                        ContractMilestoneFreelancerStatus.Submitted,
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Submit Work
                  </button>
                )}
              </>
            ) : (
              <>
                {milestone.status === ContractMilestoneStatusLabel.Submitted && (
                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handleEmployerUpdate(
                        milestone.id,
                        ContractMilestoneEmployerStatus.UnderReview,
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Review Work
                  </button>
                )}
                {(milestone.status === ContractMilestoneStatusLabel.UnderReview ||
                  milestone.status === ContractMilestoneStatusLabel.Submitted) && (
                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handleEmployerUpdate(
                        milestone.id,
                        ContractMilestoneEmployerStatus.Approved,
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {(milestone.status === ContractMilestoneStatusLabel.UnderReview ||
                  milestone.status === ContractMilestoneStatusLabel.Submitted) && (
                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handleEmployerUpdate(
                        milestone.id,
                        ContractMilestoneEmployerStatus.InProgress,
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Request Rework
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContractMilestonesList;
