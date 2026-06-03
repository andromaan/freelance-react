import { format } from "date-fns";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { useGetContractByIdQuery } from "../../services/contracts/contractsApi";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import { selectCurrentUser } from "../../store/userSlice";
import ContractMilestonesList from "./components/ContractMilestonesList";
import CreateReviewModal from "./components/CreateReviewModal";
import ContractChatModal from "../../components/chat/ContractChatModal";
import { getStatusText } from "../../utils";
import PageLoading from "../../components/ui/PageLoading";
import PageError from "../../components/ui/PageError";
import ArrowIcon from "../../components/icons/ArrowIcon";

const ContractPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isFreelancer = user?.role?.name === ROLES.FREELANCER;

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const {
    data: contract,
    isLoading,
    error,
  } = useGetContractByIdQuery(contractId!);

  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(
    contract?.projectId!,
    { skip: !contract },
  );

  if (isLoading) {
    return <PageLoading message="Loading contract details..." />;
  }

  if (error || !contract) {
    return (
      <PageError 
        message="Contract not found or error loading contract." 
        backToLabel="Back to My Contracts"
        backToPath="/my-contracts"
      />
    );
  }

  const formattedStartDate = contract.startDate
    ? format(new Date(contract.startDate), "MMM d, yyyy")
    : "N/A";
  const formattedEndDate = contract.endDate
    ? format(new Date(contract.endDate), "MMM d, yyyy")
    : null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main font-sans pb-12 pt-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => navigate("/my-contracts")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowIcon direction="left" />
            Back to My Contracts
          </button>
          <span className="text-sm font-bold tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-white">
            {getStatusText(contract.status).toUpperCase()}
          </span>
        </div>

        {/* Header */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
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
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
              <span className="flex items-center gap-1">
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
                Started: {formattedStartDate}
              </span>
              {formattedEndDate && (
                <span className="flex items-center gap-1">
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
                  Ended: {formattedEndDate}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <span className="text-xl font-bold text-text-main">
              ${contract.agreedRate}
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              {contract.status === "Completed" && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Leave a review
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-xl font-bold text-text-main mb-6">
            Milestones
          </h2>
          <ContractMilestonesList
            contractId={contract.id}
            isFreelancer={isFreelancer}
          />
        </div>
      </div>

      <CreateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        contractId={contract.id}
      />
      <ContractChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onOpen={() => setIsChatModalOpen(true)}
        contractId={contract.id}
      />
    </div>
  );
};

export default ContractPage;
