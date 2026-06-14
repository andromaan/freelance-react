import React, { useState, useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import {
  useCreateProjectMilestoneMutation,
  useUpdateProjectMilestoneMutation,
} from "../../../services/project-milestones/project-milestonesApi";
import type {
  ProjectMilestoneVM,
  CreateProjectMilestoneVM,
  UpdateProjectMilestoneVM,
} from "../../../types/project-milestone.types";
import { FormField, inputClass } from "../../../components/ui/FormKit";
import { useGetProjectByIdQuery } from "../../../services/projects/projectsApi";

// ─── Types ─────────────────────────────────────────────────────────────────

interface ProjectMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Required for CREATE mode; ignored in EDIT mode (taken from `milestone.projectId`) */
  projectId: string;
  /** When provided, the modal operates in EDIT mode */
  milestone?: ProjectMilestoneVM;
  /** Called after successful create/update */
  onSuccess?: () => void;
}

// ─── Form state ────────────────────────────────────────────────────────────

interface FormState {
  description: string;
  amount: string;
  dueDate: string;
}

interface FormErrors {
  description?: string;
  amount?: string;
  dueDate?: string;
}

const EMPTY_FORM: FormState = {
  description: "",
  amount: "",
  dueDate: "",
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function toInputDate(iso: string): string {
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.description.trim()) {
    errors.description = "Description is required";
  } else if (values.description.trim().length < 5) {
    errors.description = "Description must be at least 5 characters long";
  }

  const amount = parseFloat(values.amount);
  if (!values.amount || isNaN(amount)) {
    errors.amount = "Please enter an amount";
  } else if (amount <= 0) {
    errors.amount = "Amount must be a positive number";
  }

  if (!values.dueDate) {
    errors.dueDate = "Please specify the due date";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(values.dueDate) < today) {
      errors.dueDate = "The date cannot be in the past";
    }
  }

  return errors;
}

// ─── Main component ────────────────────────────────────────────────────────

/**
 * Universal modal for creating and editing project milestones.
 *
 * Pass `milestone` to enter EDIT mode; omit it for CREATE mode.
 * Fully WCAG 2.1 compliant via the underlying <BaseModal>.
 *
 * @example
 * // Create
 * <ProjectMilestoneModal isOpen={open} onClose={handleClose} projectId={id} />
 *
 * // Edit
 * <ProjectMilestoneModal isOpen={open} onClose={handleClose} projectId={id} milestone={m} />
 */
const ProjectMilestoneModal: React.FC<ProjectMilestoneModalProps> = ({
  isOpen,
  onClose,
  projectId,
  milestone,
  onSuccess,
}) => {
  const isEditing = !!milestone;

  const descriptionId = useId();
  const amountId = useId();
  const dueDateId = useId();

  const [createMilestone, { isLoading: isCreating }] =
    useCreateProjectMilestoneMutation();
  const [updateMilestone, { isLoading: isUpdating }] =
    useUpdateProjectMilestoneMutation();
  // todo: here project getting second time
  const { data: project } = useGetProjectByIdQuery(projectId);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});

  const { t } = useTranslation();

  // Reset form when modal opens/switches mode
  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    setSubmitError(null);
    setTouched({});

    if (milestone) {
      setForm({
        description: milestone.description ?? "",
        amount: String(milestone.amount),
        dueDate: milestone.dueDate ? toInputDate(milestone.dueDate) : "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [isOpen, milestone]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target as {
      name: keyof FormState;
      value: string;
    };
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on change if field was touched
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target as { name: keyof FormState };
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all as touched so all errors show
      setTouched({ description: true, amount: true, dueDate: true });
      return;
    }

    const dueDateISO = new Date(form.dueDate).toISOString();

    try {
      if (isEditing && milestone) {
        const payload: UpdateProjectMilestoneVM = {
          id: milestone.id,
          description: form.description.trim(),
          amount: parseFloat(form.amount),
          dueDate: dueDateISO,
        };

        await updateMilestone({ id: milestone.id, data: payload }).unwrap();
      } else {
        const payload: CreateProjectMilestoneVM = {
          projectId,
          description: form.description.trim(),
          amount: parseFloat(form.amount),
          dueDate: dueDateISO,
        };

        await createMilestone(payload).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      let message =
        err?.data?.message ??
        err?.data?.title ??
        "An error occurred. Please try again.";

      if (err?.status === 403) {
        message = "You don't have permission to perform this action.";
      }
      setSubmitError(message);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Milestone" : "New Project Milestone"}
      description={
        isEditing
          ? "Update the details of the selected milestone"
          : "Fill in the details to add a new milestone to the project"
      }
      size="md"
      // TODO
      // preventBackdropClose={isSubmitting}
      preventBackdropClose
    >
      <form
        id="milestone-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label={
          isEditing
            ? "Form for editing milestone"
            : "Form for creating milestone"
        }
        className="space-y-5"
      >
        {/* ── Server-level error ── */}
        {submitError && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-2 rounded-lg px-4 py-3 text-sm
                       bg-red-50 dark:bg-red-900/20
                       border border-red-200 dark:border-red-800
                       text-red-700 dark:text-red-400"
          >
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            {submitError}
          </div>
        )}

        {/* ── Description ── */}
        <FormField
          id={descriptionId}
          label={t("projects.milestoneModal.labelDesc")}
          required
          error={errors.description}
        >
          <textarea
            id={descriptionId}
            name="description"
            rows={3}
            required
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("projects.milestoneModal.placeholderDesc")}
            className={`${inputClass} resize-none`}
          />
        </FormField>

        {/* ── Amount + Due date side by side ── */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id={amountId}
            label={t("projects.milestoneModal.labelAmount")}
            required
            error={errors.amount}
          >
            <input
              type="number"
              id={amountId}
              name="amount"
              required
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              className={inputClass}
            />
          </FormField>

          <FormField
            id={dueDateId}
            label={t("projects.milestoneModal.labelDueDate")}
            required
            error={errors.dueDate}
          >
            <input
              type="date"
              id={dueDateId}
              name="dueDate"
              required
              value={form.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              min={new Date().toISOString().split("T")[0]}
              max={project?.deadline.split("T")[0]}
              className={inputClass}
            />
          </FormField>
        </div>

        {/* ── Required field legend ── */}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          <span aria-hidden="true">* </span>Required fields
        </p>

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border-light">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-lg
                       text-gray-700 dark:text-gray-300
                       border border-border
                       hover:bg-gray-50 dark:hover:bg-gray-800
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {t("common.cancel")}
          </button>

          <button
            type="submit"
            form="milestone-form"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg
                       bg-primary hover:bg-primary-hover text-white
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2
                       disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-sm hover:shadow-md
                       transition-all duration-150"
          >
            {isSubmitting && (
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
            )}
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Milestone"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default ProjectMilestoneModal;
