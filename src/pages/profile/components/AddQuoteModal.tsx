import React, { useState, useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import {
  FormField,
  FormErrorAlert,
  SubmitButton,
  inputClass,
} from "../../../components/ui/FormKit";
import { useCreateQuoteMutation } from "../../../services/quotes/quotesApi";
import type { CreateQuoteVM } from "../../../types/quote.types";
import { toast } from "react-toastify";

interface FormState {
  amount: string;
  message: string;
}

interface FormErrors {
  amount?: string;
  message?: string;
}

const EMPTY: FormState = { amount: "", message: "" };

function validate(f: FormState, t: any): FormErrors {
  const e: FormErrors = {};
  const amount = parseFloat(f.amount);
  if (!f.amount || isNaN(amount)) e.amount = t("profile.modals.errAmountReq");
  else if (amount <= 0) e.amount = t("profile.modals.errAmountPos");
  if (!f.message.trim()) e.message = t("profile.modals.errDescReq");
  else if (f.message.trim().length < 20)
    e.message = t("profile.modals.errDescMin");
  return e;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle?: string;
  quoteAmount?: number;
  proposalMessage?: string;
}

const AddQuoteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  quoteAmount,
  proposalMessage,
}) => {
  const { t } = useTranslation();
  const amountId = useId();
  const messageId = useId();
  const [createQuote, { isLoading }] = useCreateQuoteMutation();

  const [form, setForm] = useState<FormState>({
    amount: quoteAmount?.toString() ?? "",
    message: proposalMessage ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>(EMPTY);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      amount: quoteAmount?.toString() ?? "",
      message: proposalMessage ?? "",
    });
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target as {
      name: keyof FormState;
      value: string;
    };
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
    const payload: CreateQuoteVM = {
      projectId,
      amount: parseFloat(form.amount),
      message: form.message.trim(),
    };
    try {
      var result = await createQuote(payload).unwrap();
      toast.success(result.message || t("profile.modals.successQuote"));
      onClose();
    } catch (err: any) {
      let message =
        err?.data?.message ?? err?.data?.title ?? t("profile.modals.errFailQuote");
      if (err?.status === 409)
        message = t("profile.modals.errConflictQuote");
      if (err?.status === 403)
        message = t("profile.modals.errForbiddenQuote");
      setSubmitError(message);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("profile.modals.submitQuoteTitle")}
      description={
        projectTitle
          ? t("profile.modals.forProject", { title: projectTitle })
          : t("profile.modals.submitQuoteDesc")
      }
      size="md"
      preventBackdropClose
    >
      <form
        id="add-quote-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Submit a quote form"
        className="space-y-5"
      >
        {submitError && <FormErrorAlert message={submitError} />}

        <FormField
          id={amountId}
          label={t("profile.modals.quoteAmount")}
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
          id={messageId}
          label={t("profile.modals.proposal")}
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
            placeholder={t("profile.modals.proposalPlaceholder")}
            className={`${inputClass} resize-none`}
          />
        </FormField>

        <p className="text-xs text-gray-400 dark:text-gray-500 -mt-3 text-right">
          {form.message.trim().length} {t("profile.modals.minCharacters")}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border-light">
          <p className="text-xs text-gray-400 dark:text-gray-500 mr-auto">
            {t("profile.modals.requiredFields")}
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
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t("profile.modals.cancel")}
          </button>
          <SubmitButton
            form="add-quote-form"
            isLoading={isLoading}
            label={t("profile.modals.submitQuoteBtn")}
            loadingLabel={t("profile.modals.submittingQuote")}
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default AddQuoteModal;
