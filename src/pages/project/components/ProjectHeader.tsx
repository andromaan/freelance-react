import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../../../constants/roles";
import { selectCurrentUser } from "../../../store/userSlice";
import AddBidModal from "./AddBidModal";
import { ProjectStatus } from "../../../types/project.types";
import { getStatusText } from "../../../utils";
import ArrowIcon from "../../../components/icons/ArrowIcon";
import { useTranslation } from "react-i18next";

interface Props {
  projectId: string;
  projectBudget?: number;
  projectStatus: string;
}

const ProjectHeader: React.FC<Props> = ({
  projectId,
  projectBudget,
  projectStatus,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useSelector(selectCurrentUser);
  const [bidOpen, setBidOpen] = useState(false);

  const isFreelancer = user?.role?.name === ROLES.FREELANCER;
  const isOpen = projectStatus === ProjectStatus.Open;
  const statusBadge = (
    <span className="text-sm font-bold tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
      {getStatusText(projectStatus).toUpperCase()}
    </span>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowIcon direction="left" />
          {t("projectDetails.backToProjects")}
        </button>

        {isFreelancer && isOpen ? (
          <button
            type="button"
            id="add-bid-btn"
            onClick={() => setBidOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("projectDetails.placeBid")}
          </button>
        ) : (
          statusBadge
        )}
      </div>

      <AddBidModal
        isOpen={bidOpen}
        onClose={() => setBidOpen(false)}
        projectId={projectId}
        projectBudget={projectBudget}
      />
    </>
  );
};

export default ProjectHeader;
