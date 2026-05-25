import React, { useState, useEffect, useId } from "react";
import BaseModal from "../../../components/ui/BaseModal";
import {
  FormField,
  FormErrorAlert,
  SubmitButton,
  inputClass,
} from "../../../components/ui/FormKit";
import { useUpdateQuoteMutation } from "../../../services/quotes/quotesApi";
import { toast } from "react-toastify";
import type { QuoteVM, UpdateQuoteVM } from "../../../types/quote.types";

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  amount: string;
  message: string;
}

interface FormErrors {
  amount?: string;
  message?: string;
}

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  const amount = parseFloat(f.amount);
  if (!f.amount || isNaN(amount)) e.amount = "Please enter a quote amount";
  else if (amount <= 0) e.amount = "Amount must be a positive number";
  if (!f.message.trim()) e.message = "Description is required";
  else if (f.message.trim().length < 20)
    e.message = "At least 20 characters required";
  return e;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteVM;
}

// ─── Component ────────────────────────────────────────────────────────────────

const EditQuoteModal: React.FC<Props> = ({ isOpen, onClose, quote }) => {
  const amountId = useId();
  const messageId = useId();

  const [updateQuote, { isLoading }] = useUpdateQuoteMutation();

  const [form, setForm] = useState<FormState>({
    amount: String(quote.amount),
    message: quote.message,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync form when quote changes or modal opens
  useEffect(() => {
    if (!isOpen) return;
    setForm({ amount: String(quote.amount), message: quote.message });
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [isOpen, quote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof FormState; value: string };
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value });
      setErrors((p) => ({ ...p, [name]: errs[name] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target as { name: keyof FormState };
    setTouched((p) => ({ ...p, [name]: true }));
    const errs = validate(form);
    setErrors((p) => ({ ...p, [name]: errs[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({ amount: true, message: true });
      return;
    }
    const payload: UpdateQuoteVM = {
      amount: parseFloat(form.amount),
      message: form.message.trim(),
    };
    try {
      const result = await updateQuote({ id: quote.id, data: payload }).unwrap();
      toast.success(result.message ?? "Quote updated successfully!");
      onClose();
    } catch (err: any) {
      const message = err?.data?.message ?? err?.data?.title ?? "Failed to update quote.";
      setSubmitError(message);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Quote"
      description="Update your quote amount and proposal."
      size="md"
      preventBackdropClose
    >
      <form
        id="edit-quote-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Edit quote form"
        className="space-y-5"
      >
        {submitError && <FormErrorAlert message={submitError} />}

        <FormField id={amountId} label="Quote Amount ($)" required error={errors.amount}>
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
            className={inputClass}
          />
        </FormField>

        <FormField id={messageId} label="Proposal" required error={errors.message}>
          <textarea
            id={messageId}
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe your approach, timeline, and why you're the best fit..."
            className={`${inputClass} resize-none`}
          />
        </FormField>

        <p className="text-xs text-gray-400 dark:text-gray-500 -mt-3 text-right">
          {form.message.trim().length} / 20 min characters
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <p className="text-xs text-gray-400 dark:text-gray-500 mr-auto">
            <span aria-hidden="true">* </span>Required fields
          </p>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg
                       text-gray-700 dark:text-gray-300
                       border border-gray-300 dark:border-gray-600
                       hover:bg-gray-50 dark:hover:bg-gray-800
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <SubmitButton
            form="edit-quote-form"
            isLoading={isLoading}
            label="Save Changes"
            loadingLabel="Saving..."
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default EditQuoteModal;