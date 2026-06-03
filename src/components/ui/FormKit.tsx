import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const inputClass =
  "w-full px-3 py-2 rounded-lg border text-sm " +
  "bg-surface " +
  "text-text-main " +
  "border-border " +
  "placeholder:text-gray-500 dark:placeholder:text-gray-400/50 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary " +
  "aria-[invalid=true]:border-red-400 dark:aria-[invalid=true]:border-red-500 " +
  "transition-colors";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function toInputDate(iso: string): string {
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

// ─── Components ───────────────────────────────────────────────────────────────

export const FormField: React.FC<FieldProps> = ({
  id,
  label,
  required,
  error,
  children,
}) => {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span
            className="ml-1 text-red-500"
            aria-hidden="true"
            title="Required"
          >
            *
          </span>
        )}
      </label>

      {React.isValidElement(children) &&
        React.cloneElement(
          children as React.ReactElement<{
            "aria-describedby"?: string;
            "aria-invalid"?: "true" | "false";
          }>,
          {
            "aria-describedby": error ? errorId : undefined,
            "aria-invalid": error ? "true" : undefined,
          },
        )}

      {error && (
        <p
          id={errorId}
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
          {error}
        </p>
      )}
    </div>
  );
};

export const FormErrorAlert: React.FC<{ message: string }> = ({ message }) => (
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
    {message}
  </div>
);

interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  loadingLabel?: string;
  form?: string;
  onClick?: () => void;
  type?: "submit" | "button";
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  label,
  loadingLabel = "Saving…",
  form,
  onClick,
  type = form ? "submit" : "button",
}) => (
  <button
    type={type}
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

export const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700/60" />
    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
      {label}
    </span>
    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700/60" />
  </div>
);
