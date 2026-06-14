import React, { useState, useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import {
  FormField,
  FormErrorAlert,
  SubmitButton,
  inputClass,
} from "../../../components/ui/FormKit";
import { useUpdateBidMutation } from "../../../services/bids/bidsApi";
import { toast } from "react-toastify";
import type { BidVM, UpdateBidVM } from "../../../types/bid.types";

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  amount: string;
  message: string;
}

interface FormErrors {
  amount?: string;
  message?: string;
}

function validate(f: FormState, t: any): FormErrors {
  const e: FormErrors = {};
  const amount = parseFloat(f.amount);
  if (!f.amount || isNaN(amount)) e.amount = t("profile.modals.errAmountReqBid");
  else if (amount <= 0) e.amount = t("profile.modals.errAmountPos");
  if (!f.message.trim()) e.message = t("profile.modals.errDescReqBid");
  else if (f.message.trim().length < 20)
    e.message = t("profile.modals.errDescMin");
  return e;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bid: BidVM;
}

// ─── Component ────────────────────────────────────────────────────────────────

const EditBidModal: React.FC<Props> = ({ isOpen, onClose, bid }) => {
  const { t } = useTranslation();
  const amountId = useId();
  const messageId = useId();

  const [updateBid, { isLoading }] = useUpdateBidMutation();

  const [form, setForm] = useState<FormState>({
    amount: String(bid.amount),
    message: bid.message,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync form when bid changes or modal opens
  useEffect(() => {
    if (!isOpen) return;
    setForm({ amount: String(bid.amount), message: bid.message });
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [isOpen, bid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof FormState; value: string };
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value }, t);
      setErrors((p) => ({ ...p, [name]: errs[name] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const payload: UpdateBidVM = {
      amount: parseFloat(form.amount),
      message: form.message.trim(),
    };
    try {
      const result = await updateBid({ id: bid.id, data: payload }).unwrap();
      toast.success(result.message ?? t("profile.modals.successBid"));
      onClose();
    } catch (err: any) {
      const message = err?.data?.message ?? err?.data?.title ?? t("profile.modals.errFailBid");
      setSubmitError(message);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("profile.modals.editBidTitle")}
      description={t("profile.modals.editBidDesc")}
      size="md"
      preventBackdropClose
    >
      <form
        id="edit-bid-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Edit bid form"
        className="space-y-5"
      >
        {submitError && <FormErrorAlert message={submitError} />}

        <FormField id={amountId} label={t("profile.modals.bidAmount")} required error={errors.amount}>
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

        <FormField id={messageId} label={t("profile.modals.coverLetter")} required error={errors.message}>
          <textarea
            id={messageId}
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("profile.modals.coverLetterPlaceholder")}
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
            form="edit-bid-form"
            isLoading={isLoading}
            label={t("profile.modals.saveChanges")}
            loadingLabel={t("profile.modals.savingChanges")}
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default EditBidModal;
