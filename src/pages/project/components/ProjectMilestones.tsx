import React from "react";
import {
  useGetProjectMilestonesByProjectQuery
} from "../../../services/project-milestones/project-milestonesApi";
import type { ProjectMilestoneVM } from "../../../types/project-milestone.types";
import { useTranslation } from "react-i18next";
import { formatDateLocalized } from "../../../utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Props {
  projectId: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return formatDateLocalized(iso, {
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
  <div className="animate-pulse flex justify-between items-center p-4 rounded-xl border border-border-light">
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
  t: any;
}

const MilestoneRow: React.FC<MilestoneRowProps> = ({
  milestone, t
}) => (
  <div
    className="group flex items-start justify-between gap-4 p-4 rounded-xl
               border border-gray-300 dark:border-gray-700
               bg-gray-100 dark:bg-gray-900/50"
  >
    {/* Left — description + date */}
    <div className="min-w-0">
      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
        {milestone.description || <em className="text-gray-400">{t("projectDetails.noDescription")}</em>}
      </p>
      <p className="mt-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 tracking-wide">
        {t("projectDetails.due")}: {formatDate(milestone.dueDate)}
      </p>
    </div>

    {/* Right — amount + actions */}
    <div className="flex-shrink-0 flex flex-col items-end gap-2">
      <span className="text-sm font-bold text-text-main">
        ${milestone.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </span>
    </div>
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────

const ProjectMilestones: React.FC<Props> = ({ projectId }) => {
  const { t } = useTranslation();
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
        className="bg-surface rounded-xl p-6 border border-border shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-light">
          <div>
            <h2
              id="milestones-heading"
              className="text-lg font-bold text-text-main"
            >
              {t("projectDetails.milestones")}
            </h2>
            {milestones && milestones.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {t("projectDetails.total")}:{" "}
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
            {t("projectDetails.milestonesFailed")}
          </p>
        ) : !milestones || milestones.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-text-muted">
              {t("projectDetails.noMilestones")}
            </p>
          </div>
        ): (
          <ul className="space-y-3" aria-label="List of Project Milestones">
            {milestones.map((m) => (
              <li key={m.id}>
                <MilestoneRow
                  milestone={m}
                  t={t}
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
