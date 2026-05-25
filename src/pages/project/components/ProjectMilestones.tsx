import React from "react";
import {
  useGetProjectMilestonesByProjectQuery
} from "../../../services/project-milestones/project-milestonesApi";
import type { ProjectMilestoneVM } from "../../../types/project-milestone.types";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Props {
  projectId: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Skeleton row ────────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
  <div className="animate-pulse flex justify-between items-center p-4 rounded-xl border border-gray-100 dark:border-gray-700">
    <div className="space-y-2 flex-1">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-4" />
  </div>
);

// ─── Milestone row ────────────────────────────────────────────────────────────

interface MilestoneRowProps {
  milestone: ProjectMilestoneVM;
}

const MilestoneRow: React.FC<MilestoneRowProps> = ({
  milestone
}) => (
  <div
    className="group flex items-start justify-between gap-4 p-4 rounded-xl
               border border-gray-300 dark:border-gray-700
               bg-gray-100 dark:bg-gray-900/50"
  >
    {/* Left — description + date */}
    <div className="min-w-0">
      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
        {milestone.description || <em className="text-gray-400">No description</em>}
      </p>
      <p className="mt-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
        Due: {formatDate(milestone.dueDate)}
      </p>
    </div>

    {/* Right — amount + actions */}
    <div className="flex-shrink-0 flex flex-col items-end gap-2">
      <span className="text-sm font-bold text-gray-900 dark:text-white">
        ${milestone.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </span>
    </div>
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────

const ProjectMilestones: React.FC<Props> = ({ projectId }) => {
  const {
    data: milestones,
    isLoading,
    isError,
  } = useGetProjectMilestonesByProjectQuery(projectId, { skip: !projectId });

  const total =
    milestones?.reduce((sum, m) => sum + m.amount, 0) ?? 0;

  return (
    <>
      {/* ── Card ── */}
      <section
        aria-labelledby="milestones-heading"
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2
              id="milestones-heading"
              className="text-lg font-bold text-gray-900 dark:text-white"
            >
              Project Milestones
            </h2>
            {milestones && milestones.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Total:{" "}
                <strong className="text-gray-700 dark:text-gray-300">
                  ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </strong>
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading milestones">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : isError ? (
          <p
            role="alert"
            className="text-center py-8 text-sm text-red-500 dark:text-red-400"
          >
            Failed to load milestones. Please try again later.
          </p>
        ) : !milestones || milestones.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No milestones added yet.
            </p>
          </div>
        ): (
          <ul className="space-y-3" aria-label="List of Project Milestones">
            {milestones.map((m) => (
              <li key={m.id}>
                <MilestoneRow
                  milestone={m}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default ProjectMilestones;
