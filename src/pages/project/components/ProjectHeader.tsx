import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../../../constants/roles";
import { selectCurrentUser } from "../../../store/userSlice";
import AddBidModal from "./AddBidModal";

interface Props {
  status: string;
  projectId: string;
  projectBudget?: number;
}

const ProjectHeader: React.FC<Props> = ({ status, projectId, projectBudget }) => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [bidOpen, setBidOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>

        {user?.role?.name === ROLES.FREELANCER && (
          <button
            type="button"
            id="add-bid-btn"
            onClick={() => setBidOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Place a Bid
          </button>
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
