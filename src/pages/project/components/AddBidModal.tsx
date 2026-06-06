import React, { useState, useEffect, useId } from "react";
import BaseModal from "../../../components/ui/BaseModal";
import {
  FormField,
  FormErrorAlert,
  SubmitButton,
  inputClass,
} from "../../../components/ui/FormKit";
import { useCreateBidMutation } from "../../../services/bids/bidsApi";
import type { CreateBidVM } from "../../../types/bid.types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// ─── Form types ───────────────────────────────────────────────────────────────

interface FormState {
  amount: string;
  message: string;
}

interface FormErrors {
  amount?: string;
  message?: string;
}

const EMPTY: FormState = { amount: "", message: "" };

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(f: FormState, t: any): FormErrors {
  const e: FormErrors = {};

  const amount = parseFloat(f.amount);
  if (!f.amount || isNaN(amount)) e.amount = t("bids.errors.amountRequired");
  else if (amount <= 0) e.amount = t("bids.errors.amountPositive");

  if (!f.message.trim()) e.message = t("bids.errors.coverLetterRequired");
  else if (f.message.trim().length < 20)
    e.message = t("bids.errors.coverLetterLength");

  return e;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  /** Optional: project budget for a hint label */
  projectBudget?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AddBidModal: React.FC<Props> = ({
  isOpen,
  onClose,
  projectId,
  projectBudget,
}) => {
  const { t } = useTranslation();
  const amountId = useId();
  const messageId = useId();

  const [createBid, { isLoading }] = useCreateBidMutation();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (!isOpen) return;
    setForm(EMPTY);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [isOpen]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target as { name: keyof FormState; value: string };
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value }, t);
      setErrors((p) => ({ ...p, [name]: errs[name] }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target as { name: keyof FormState };
    setTouched((p) => ({ ...p, [name]: true }));
    const errs = validate(form, t);
    setErrors((p) => ({ ...p, [name]: errs[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errs = validate(form, t);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({ amount: true, message: true });
      return;
    }

    const payload: CreateBidVM = {
      projectId,
      amount: parseFloat(form.amount),
      message: form.message.trim(),
    };

    try {
      await createBid(payload).unwrap();

      toast.success(t("bids.success"));
      onClose();
    } catch (err: any) {
      let message =
        err?.data?.message ??
        err?.data?.title ??
        t("bids.errors.failedSubmit");
      if (err?.status === 403)
        message = t("bids.errors.noPermission");
      if (err?.status === 409)
        message = t("bids.errors.alreadyBid");
      setSubmitError(message);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("bids.modalTitle")}
      description={t("bids.modalDesc")}
      size="md"
      preventBackdropClose
    >
      <form
        id="add-bid-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Place a bid form"
        className="space-y-5"
      >
        {/* Server error */}
        {submitError && <FormErrorAlert message={submitError} />}

        {/* Amount */}
        <FormField
          id={amountId}
          label={
            projectBudget
              ? t("bids.amountLabelBudget", { budget: projectBudget.toLocaleString("en-US") })
              : t("bids.amountLabel")
          }
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

        {/* Cover letter */}
        <FormField
          id={messageId}
          label={t("bids.coverLetterLabel")}
          required
          error={errors.message}
        >
          <textarea
            id={messageId}
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("bids.coverLetterPlaceholder")}
            className={`${inputClass} resize-none`}
          />
        </FormField>

        {/* Character counter hint */}
        <p className="text-xs text-gray-400 dark:text-gray-500 -mt-3 text-right">
          {t("bids.charCount", { count: form.message.trim().length })}
        </p>

        {/* Required legend + actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border-light">
          <p className="text-xs text-gray-400 dark:text-gray-500 mr-auto">
            <span aria-hidden="true">* </span>{t("bids.requiredFields")}
          </p>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg
                       text-gray-700 dark:text-gray-300
                       border border-border
                       hover:bg-gray-50 dark:hover:bg-gray-800
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {t("bids.cancel")}
          </button>

          <SubmitButton
            form="add-bid-form"
            isLoading={isLoading}
            label={t("bids.submitBid")}
            loadingLabel={t("bids.submitting")}
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default AddBidModal;
