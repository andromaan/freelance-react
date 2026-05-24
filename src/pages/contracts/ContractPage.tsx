import { format } from "date-fns";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { useGetContractByIdQuery } from "../../services/contracts/contractsApi";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import { selectCurrentUser } from "../../store/userSlice";
import ContractMilestonesList from "./components/ContractMilestonesList";

const ContractPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isFreelancer = user?.role?.name === ROLES.FREELANCER;

  const { data: contract, isLoading, error } = useGetContractByIdQuery(contractId!);

  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(
      contract?.projectId!, { skip: !contract },
    );


  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Loading contract details...</span>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
        <span className="text-red-500">Contract not found or error loading contract.</span>
        <button
          onClick={() => navigate("/my-contracts")}
          className="text-primary hover:text-primary-hover underline"
        >
          Back to My Contracts
        </button>
      </div>
    );
  }

  const formattedStartDate = contract.startDate
    ? format(new Date(contract.startDate), "MMM d, yyyy")
    : "N/A";
  const formattedEndDate = contract.endDate
    ? format(new Date(contract.endDate), "MMM d, yyyy")
    : null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 font-sans pb-12 pt-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 min-w-0">
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
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Started: {formattedStartDate}
              </span>
              {formattedEndDate && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ended: {formattedEndDate}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
              Status: {contract.status.split(/(?=[A-Z])/).join(" ")}
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${contract.agreedRate}
            </span>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Milestones</h2>
          <ContractMilestonesList contractId={contract.id} isFreelancer={isFreelancer} />
        </div>
      </div>
    </div>
  );
};

export default ContractPage;
