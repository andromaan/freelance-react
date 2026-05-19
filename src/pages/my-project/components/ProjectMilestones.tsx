import React, { useState } from "react";
import {
  useGetProjectMilestonesByProjectQuery,
  useDeleteProjectMilestoneMutation,
} from "../../../services/project-milestones/project-milestonesApi";
import type { ProjectMilestoneVM } from "../../../types/project-milestone.types";
import ProjectMilestoneModal from "./ProjectMilestoneModal";

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
  onEdit: (m: ProjectMilestoneVM) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const MilestoneRow: React.FC<MilestoneRowProps> = ({
  milestone,
  onEdit,
  onDelete,
  isDeleting,
}) => (
  <div
    className="group flex items-start justify-between gap-4 p-4 rounded-xl
               border border-gray-100 dark:border-gray-700
               bg-gray-50 dark:bg-gray-900/50
               hover:border-primary/30 dark:hover:border-primary/30
               hover:bg-primary/5 dark:hover:bg-primary/5
               transition-all duration-150"
  >
    {/* Left — description + date */}
    <div className="min-w-0">
      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
        {milestone.description || <em className="text-gray-400">Без опису</em>}
      </p>
      <p className="mt-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
        До: {formatDate(milestone.dueDate)}
      </p>
    </div>

    {/* Right — amount + actions */}
    <div className="flex-shrink-0 flex flex-col items-end gap-2">
      <span className="text-sm font-bold text-gray-900 dark:text-white">
        ${milestone.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </span>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(milestone)}
          aria-label={`Редагувати етап на суму $${milestone.amount}`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                     transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(milestone.id)}
          disabled={isDeleting}
          aria-label={`Видалити етап на суму $${milestone.amount}`}
          aria-busy={isDeleting}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60
                     disabled:opacity-50 disabled:cursor-wait
                     transition-colors"
        >
          {isDeleting ? (
            <svg
              className="w-3.5 h-3.5 animate-spin"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>
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

  const [deleteMilestone, { isLoading: isDeleting, originalArgs: deletingId }] =
    useDeleteProjectMilestoneMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<
    ProjectMilestoneVM | undefined
  >();

  const openCreate = () => {
    setEditingMilestone(undefined);
    setModalOpen(true);
  };

  const openEdit = (m: ProjectMilestoneVM) => {
    setEditingMilestone(m);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Видалити цей етап?")) return;
    try {
      await deleteMilestone(id).unwrap();
    } catch {
      // errors handled silently; could be replaced with a toast
    }
  };

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
              Етапи проєкту
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

          <button
            type="button"
            id="add-milestone-btn"
            onClick={openCreate}
            aria-label="Add New Milestone"
            className="inline-flex items-center gap-1.5 px-3 py-1.5
                       bg-primary hover:bg-primary-hover text-white text-xs font-semibold
                       rounded-lg transition-colors shadow-sm hover:shadow
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
          >
            <svg
              className="w-3.5 h-3.5"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Milestone
          </button>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Завантаження етапів">
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
            <button
              type="button"
              onClick={openCreate}
              className="mt-3 text-xs text-primary hover:text-primary-hover underline
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              Add First Milestone
            </button>
          </div>
        ) : (
          <ul className="space-y-3" aria-label="List of Project Milestones">
            {milestones.map((m) => (
              <li key={m.id}>
                <MilestoneRow
                  milestone={m}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  isDeleting={isDeleting && deletingId === m.id}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Modal ── */}
      <ProjectMilestoneModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projectId}
        milestone={editingMilestone}
      />
    </>
  );
};

export default ProjectMilestones;
