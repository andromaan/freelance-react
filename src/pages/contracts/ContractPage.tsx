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
import CreateDisputeModal from "./components/CreateDisputeModal";
import ContractChatModal from "../../components/chat/ContractChatModal";
import { useGetIsReviewedQuery } from "../../services/reviews/reviewsApi";
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
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const {
    data: contract,
    isLoading,
    error,
  } = useGetContractByIdQuery(contractId!);

  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(
    contract?.projectId!,
    { skip: !contract },
  );

  const { data: reviewedData, isLoading: isReviewLoading } =
    useGetIsReviewedQuery(contract?.id!, {
      skip: !contract || contract.status !== "Completed",
    });

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
          <div className="flex items-center gap-3">
            {contract.status !== "Disputed" &&
              contract.status !== "Cancelled" &&
              contract.status !== "Completed" && (
                <button
                  onClick={() => setIsDisputeModalOpen(true)}
                  className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-full transition-colors border border-red-300 dark:border-red-800/70 dark:text-red-600/90 focus:outline-none"
                >
                  Open Dispute
                </button>
              )}
            <span className="text-sm font-bold tracking-wider px-3 py-1 rounded-full bg-primary/5 text-primary dark:text-white border border-primary/50 dark:border-white/30">
              {getStatusText(contract.status).toUpperCase()}
            </span>
          </div>
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
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              {contract.status === "Completed" &&
                (isReviewLoading ? (
                  <span className="text-sm text-text-muted">
                    Loading review status...
                  </span>
                ) : reviewedData ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-border">
                    <span className="text-sm font-medium text-text-main">
                      Review Added:
                    </span>
                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 text-sm font-bold">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {reviewedData.rating}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    Leave a review
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-xl font-bold text-text-main mb-6">Milestones</h2>
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
      <CreateDisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
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
