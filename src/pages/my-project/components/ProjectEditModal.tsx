import React, { useState, useEffect, useId } from "react";
import Select from "react-select";
import BaseModal from "../../../components/ui/BaseModal";
import {
  useUpdateProjectMutation,
  useUpdateProjectCategoriesMutation,
} from "../../../services/projects/projectsApi";
import type { ProjectVM, UpdateProjectVM } from "../../../types/project.types";
import type { CategoriesVM } from "../../../types/category.types";
import {
  buildSelectStyles,
  type SelectOption,
} from "../../../styles/selectStyles";
import { toast } from "react-toastify";
import { SectionDivider, FormErrorAlert, FormField, inputClass } from "../../../components/ui/FormKit";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectVM;
  /** All available categories fetched from the server */
  availableCategories: CategoriesVM[];
}

interface FieldsForm {
  title: string;
  description: string;
  budget: string;
  deadline: string;
}

interface FieldsErrors {
  title?: string;
  description?: string;
  budget?: string;
  deadline?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toInputDate(iso: string): string {
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function validateFields(f: FieldsForm): FieldsErrors {
  const errors: FieldsErrors = {};
  if (!f.title.trim()) errors.title = "Title is required";
  else if (f.title.trim().length < 3) errors.title = "At least 3 characters";

  if (!f.description.trim()) errors.description = "Description is required";
  else if (f.description.trim().length < 10)
    errors.description = "At least 10 characters";

  const budget = parseFloat(f.budget);
  if (!f.budget || isNaN(budget)) errors.budget = "Please enter a budget";
  else if (budget <= 0) errors.budget = "Must be a positive number";

  if (!f.deadline) errors.deadline = "Deadline is required";

  return errors;
}

// ─── Spinner button helper ────────────────────────────────────────────────────

interface SaveBtnProps {
  isLoading: boolean;
  label: string;
  loadingLabel?: string;
  form?: string;
  onClick?: () => void;
}

const SaveBtn: React.FC<SaveBtnProps> = ({
  isLoading,
  label,
  loadingLabel = "Saving…",
  form,
  onClick,
}) => (
  <button
    type={form ? "submit" : "button"}
    form={form}
    onClick={onClick}
    disabled={isLoading}
    aria-busy={isLoading}
    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg
               bg-primary hover:bg-primary-hover text-white
               focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2
               disabled:opacity-60 disabled:cursor-not-allowed
               shadow-sm hover:shadow-md transition-all duration-150"
  >
    {isLoading && (
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
    {isLoading ? loadingLabel : label}
  </button>
);

// ─── Main component ────────────────────────────────────────────────────────────

/**
 * Modal for editing a project.
 *
 * - **Fields section** (title, description, budget, deadline) → PUT /Project/:id
 * - **Categories section** (multi-select chips) → PATCH /Project/categories/:id
 *
 * Both sections save independently so a failure in one doesn't block the other.
 */
const ProjectEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  project,
  availableCategories,
}) => {
  // ── IDs ──────────────────────────────────────────────────────────────────
  const titleId = useId();
  const descriptionId = useId();
  const budgetId = useId();
  const deadlineId = useId();

  // ── RTK mutations ─────────────────────────────────────────────────────────
  const [updateProject, { isLoading: isSavingFields }] =
    useUpdateProjectMutation();
  const [updateCategories, { isLoading: isSavingCategories }] =
    useUpdateProjectCategoriesMutation();

  // ── Fields form state ─────────────────────────────────────────────────────
  const [fields, setFields] = useState<FieldsForm>({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldsErrors>({});
  const [fieldsTouched, setFieldsTouched] = useState<
    Partial<Record<keyof FieldsForm, boolean>>
  >({});
  const [fieldsServerError, setFieldsServerError] = useState<string | null>(
    null,
  );

  // ── Categories state ──────────────────────────────────────────────────────
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [catServerError, setCatServerError] = useState<string | null>(null);

  // ── Reset when modal opens ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setFields({
      title: project.title,
      description: project.description,
      budget: String(project.budget),
      deadline: project.deadline ? toInputDate(project.deadline) : "",
    });
    setFieldErrors({});
    setFieldsTouched({});
    setFieldsServerError(null);
    setSelectedCategoryIds(project.categories?.map((c) => c.id) ?? []);
    setCatServerError(null);
  }, [isOpen, project]);

  // ── Field handlers ────────────────────────────────────────────────────────
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target as {
      name: keyof FieldsForm;
      value: string;
    };
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldsTouched[name]) {
      const errs = validateFields({ ...fields, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleFieldBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target as { name: keyof FieldsForm };
    setFieldsTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validateFields(fields);
    setFieldErrors((prev) => ({ ...prev, [name]: errs[name] }));
  };

  const handleFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldsServerError(null);

    const errs = validateFields(fields);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setFieldsTouched({
        title: true,
        description: true,
        budget: true,
        deadline: true,
      });
      return;
    }

    const payload: UpdateProjectVM = {
      title: fields.title.trim(),
      description: fields.description.trim(),
      budget: parseFloat(fields.budget),
      deadline: new Date(fields.deadline).toISOString(),
    };

    try {
      const result = await updateProject({ id: project.id, data: payload }).unwrap();
      toast.success(result.message);
    } catch (err: any) {
      setFieldsServerError(
        err?.data?.message ??
          err?.data?.title ??
          "Failed to save. Please try again.",
      );
    }
  };

  // ── Category react-select helpers ─────────────────────────────────────────
  const categoryOptions: SelectOption<number>[] = availableCategories.map(
    (c) => ({
      value: c.id,
      label: c.name,
    }),
  );

  const selectedCategoryOptions = categoryOptions.filter((o) =>
    selectedCategoryIds.includes(o.value),
  );

  const handleCategoryChange = (selected: readonly SelectOption<number>[]) => {
    setSelectedCategoryIds(selected.map((o) => o.value));
  };

  const handleCategoriesSave = async () => {
    setCatServerError(null);
    try {
      await updateCategories({
        projectId: project.id,
        data: { categoryIds: selectedCategoryIds },
      }).unwrap();

      toast.success("Categories updated successfully");
    } catch (err: any) {
      setCatServerError(
        err?.data?.message ??
          err?.data?.title ??
          "Failed to update categories.",
      );
    }
  };

  // todo: delete this if we keep independent saving
  // const isAnySaving = isSavingFields || isSavingCategories;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      description="Changes are saved per section."
      size="xl"
      preventBackdropClose
    >
      <div className="space-y-8">
        {/* ════════════════ FIELDS SECTION ════════════════ */}
        <section aria-labelledby="edit-fields-heading">
          <SectionDivider label="Project details" />

          {fieldsServerError && (
            <div className="mt-3">
              <FormErrorAlert message={fieldsServerError} />
            </div>
          )}

          <form
            id="project-fields-form"
            onSubmit={handleFieldsSubmit}
            noValidate
            aria-label="Edit project fields"
            className="mt-4 space-y-4"
          >
            {/* Title */}
            <FormField
              id={titleId}
              label="Title"
              required
              error={fieldErrors.title}
            >
              <input
                type="text"
                id={titleId}
                name="title"
                required
                value={fields.title}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                placeholder="Project title"
                className={inputClass}
              />
            </FormField>

            {/* Description */}
            <FormField
              id={descriptionId}
              label="Description"
              required
              error={fieldErrors.description}
            >
              <textarea
                id={descriptionId}
                name="description"
                rows={4}
                required
                value={fields.description}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                placeholder="What does this project involve?"
                className={`${inputClass} resize-none`}
              />
            </FormField>

            {/* Budget + Deadline side by side */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id={budgetId}
                label="Budget ($)"
                required
                error={fieldErrors.budget}
              >
                <input
                  type="number"
                  id={budgetId}
                  name="budget"
                  required
                  min="0.01"
                  step="0.01"
                  value={fields.budget}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  placeholder="0.00"
                  className={inputClass}
                />
              </FormField>

              <FormField
                id={deadlineId}
                label="Deadline"
                required
                error={fieldErrors.deadline}
              >
                <input
                  type="date"
                  id={deadlineId}
                  name="deadline"
                  required
                  value={fields.deadline}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={inputClass}
                />
              </FormField>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 mr-auto">
                <span aria-hidden="true">* </span>Required fields
              </p>
              <SaveBtn
                form="project-fields-form"
                isLoading={isSavingFields}
                label="Save Details"
                loadingLabel="Saving…"
              />
            </div>
          </form>
        </section>

        {/* ════════════════ CATEGORIES SECTION ════════════════ */}
        <section aria-labelledby="edit-categories-heading">
          <SectionDivider label="Categories" />

          {catServerError && (
            <div className="mt-3">
              <FormErrorAlert message={catServerError} />
            </div>
          )}

          <div className="mt-4">
            <Select<SelectOption<number>, true>
              inputId="project-categories-select"
              isMulti
              menuPlacement="top"
              options={categoryOptions}
              value={selectedCategoryOptions}
              onChange={handleCategoryChange}
              styles={buildSelectStyles<number>()}
              placeholder="Select categories…"
              noOptionsMessage={() => "No categories available"}
              aria-label="Select project categories"
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <SaveBtn
              isLoading={isSavingCategories}
              label="Save Categories"
              loadingLabel="Saving…"
              onClick={handleCategoriesSave}
            />
          </div>
        </section>
      </div>
    </BaseModal>
  );
};

export default ProjectEditModal;
