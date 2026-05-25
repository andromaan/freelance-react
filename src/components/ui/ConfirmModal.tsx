import React from "react";
import BaseModal from "./BaseModal";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmModalProps {
  /** Controls visibility */
  isOpen: boolean;
  /** Called when the user cancels or closes */
  onClose: () => void;
  /** Called when the user confirms the action */
  onConfirm: () => void;
  /** Modal heading */
  title: string;
  /** Descriptive text about what will happen */
  description?: React.ReactNode;
  /** Label for the confirm button (default: "Confirm") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;
  /** Disable confirm button (e.g. while async action is pending) */
  isLoading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Reusable confirmation dialog.
 * Built on BaseModal — inherits full WCAG 2.1 accessibility support.
 *
 * Usage:
 * ```tsx
 * <ConfirmModal
 *   isOpen={isDeleteOpen}
 *   onClose={() => setDeleteOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Видалити етап?"
 *   description="Цю дію не можна скасувати."
 * />
 * ```
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      preventBackdropClose
    >
      {description && (
        <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 flex-wrap">
        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium rounded-lg
                     text-gray-700 dark:text-gray-300
                     border border-gray-300 dark:border-gray-600
                     hover:bg-gray-50 dark:hover:bg-gray-800
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {cancelLabel}
        </button>

        {/* Confirm */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          aria-busy={isLoading}
          className="inline-flex items-center justify-center gap-2 min-w-[6rem]
                     px-5 py-2 text-sm font-semibold rounded-lg
                     bg-red-500 hover:bg-red-600 text-white
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-2
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-sm hover:shadow-md
                     transition-all duration-150"
        >
          {isLoading ? (
            <svg
              className="w-4 h-4 animate-spin"
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
            confirmLabel
          )}
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
