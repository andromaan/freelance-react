import React, { useState, useEffect, useId } from "react";
import Select from "react-select";
import BaseModal from "../../../components/ui/BaseModal";
import { useCreateProjectMutation } from "../../../services/projects/projectsApi";
import { useGetAllCategoriesQuery } from "../../../services/categories/categoriesApi";
import type { CreateProjectVM } from "../../../types/project.types";
import {
  useSelectStyles,
  type SelectOption,
} from "../../../styles/selectStyles";
import { toast } from "react-toastify";
import { FormField, inputClass } from "../../../components/ui/FormKit";

// ─── Form types ───────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  description: string;
  budget: string;
  deadline: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  budget?: string;
  deadline?: string;
  categories?: string;
}

const EMPTY: FormState = {
  title: "",
  description: "",
  budget: "",
  deadline: "",
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(f: FormState, catIds: number[]): FormErrors {
  const e: FormErrors = {};
  if (!f.title.trim()) e.title = "Title is required";
  else if (f.title.trim().length < 3) e.title = "At least 3 characters";

  if (!f.description.trim()) e.description = "Description is required";
  else if (f.description.trim().length < 10)
    e.description = "At least 10 characters";

  const budget = parseFloat(f.budget);
  if (!f.budget || isNaN(budget)) e.budget = "Please enter a budget";
  else if (budget <= 0) e.budget = "Must be a positive number";

  if (!f.deadline) e.deadline = "Deadline is required";
  else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(f.deadline) < today) e.deadline = "Cannot be in the past";
  }

  if (catIds.length === 0) e.categories = "Select at least one category";

  return e;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CreateProjectModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const titleId = useId();
  const descId = useId();
  const budgetId = useId();
  const deadlineId = useId();

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const { data: allCategories = [], isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState | "categories", boolean>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (!isOpen) return;
    setForm(EMPTY);
    setSelectedCategoryIds([]);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [isOpen]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target as {
      name: keyof FormState;
      value: string;
    };
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value }, selectedCategoryIds);
      setErrors((p) => ({ ...p, [name]: errs[name] }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target as { name: keyof FormState };
    setTouched((p) => ({ ...p, [name]: true }));
    const errs = validate(form, selectedCategoryIds);
    setErrors((p) => ({ ...p, [name]: errs[name] }));
  };

  const categoryOptions: SelectOption<number>[] = allCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const selectedCategoryOptions = categoryOptions.filter((o) =>
    selectedCategoryIds.includes(o.value),
  );

  const handleCategoryChange = (selected: readonly SelectOption<number>[]) => {
    const ids = selected.map((o) => o.value);
    setSelectedCategoryIds(ids);
    if (touched.categories) {
      const errs = validate(form, ids);
      setErrors((p) => ({ ...p, categories: errs.categories }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errs = validate(form, selectedCategoryIds);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({
        title: true,
        description: true,
        budget: true,
        deadline: true,
        categories: true,
      });
      return;
    }

    const payload: CreateProjectVM = {
      title: form.title.trim(),
      description: form.description.trim(),
      budget: parseFloat(form.budget),
      deadline: new Date(form.deadline).toISOString(),
      categoryIds: selectedCategoryIds,
    };

    try {
      await createProject(payload).unwrap();

      toast.success("Project created successfully");
      onClose();
    } catch (err: any) {
      setSubmitError(
        err?.data?.message ?? err?.data?.title ?? "Failed to create project.",
      );
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Fill in the details to create a new project."
      size="lg"
      preventBackdropClose
    >
      <form
        id="create-project-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {/* Server error */}
        {submitError && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-2 rounded-lg px-4 py-3 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
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

        {/* Title */}
        <FormField id={titleId} label="Title" required error={errors.title}>
          <input
            type="text"
            id={titleId}
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Project title"
            className={inputClass}
          />
        </FormField>

        {/* Description */}
        <FormField
          id={descId}
          label="Description"
          required
          error={errors.description}
        >
          <textarea
            id={descId}
            name="description"
            rows={4}
            required
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="What does this project involve?"
            className={`${inputClass} resize-none`}
          />
        </FormField>

        {/* Budget + Deadline */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id={budgetId}
            label="Budget ($)"
            required
            error={errors.budget}
          >
            <input
              type="number"
              id={budgetId}
              name="budget"
              required
              min="0.01"
              step="0.01"
              value={form.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              className={inputClass}
            />
          </FormField>

          <FormField
            id={deadlineId}
            label="Deadline"
            required
            error={errors.deadline}
          >
            <input
              type="date"
              id={deadlineId}
              name="deadline"
              required
              value={form.deadline}
              onChange={handleChange}
              onBlur={handleBlur}
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </FormField>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Categories{" "}
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <Select<SelectOption<number>, true>
            inputId="create-project-categories"
            isMulti
            menuPlacement="top"
            options={categoryOptions}
            value={selectedCategoryOptions}
            onChange={handleCategoryChange}
            isLoading={isCategoriesLoading}
            styles={useSelectStyles<number>()}
            placeholder="Select categories…"
            noOptionsMessage={() => "No categories available"}
            aria-label="Select project categories"
          />
          {errors.categories && (
            <p
              role="alert"
              className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.categories}
            </p>
          )}
        </div>

        {/* Required + submit */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <p className="text-xs text-gray-400 dark:text-gray-500 mr-auto">
            <span aria-hidden="true">* </span>Required fields
          </p>

          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="create-project-form"
            disabled={isCreating}
            aria-busy={isCreating}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-primary hover:bg-primary-hover text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-150"
          >
            {isCreating && (
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
            {isCreating ? "Creating…" : "Create Project"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateProjectModal;
