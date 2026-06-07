import React, { useState } from "react";
import BaseModal from "../../../components/ui/BaseModal";
import { toast } from "react-toastify";
import { useCreateDisputeMutation } from "../../../services/disputes/disputesApi";
import { useTranslation } from "react-i18next";

interface CreateDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
}

const CreateDisputeModal: React.FC<CreateDisputeModalProps> = ({
  isOpen,
  onClose,
  contractId,
}) => {
  const [reason, setReason] = useState("");
  const [createDispute, { isLoading }] = useCreateDisputeMutation();
  const { t } = useTranslation();

  const handleCreate = async () => {
    if (!reason.trim()) {
      toast.error(t("contracts.disputeReasonRequired", "Please provide a reason for the dispute."));
      return;
    }

    try {
      await createDispute({
        contractId,
        reason,
      }).unwrap();

      toast.success(t("contracts.disputeCreatedSuccess", "Dispute created successfully."));
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.title || error?.data?.message || t("contracts.disputeCreatedFailed", "Failed to create dispute."));
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("contracts.openDispute", "Open Dispute")}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            {t("contracts.disputeReason", "Reason for Dispute")}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-main resize-none"
            rows={4}
            placeholder={t("contracts.disputeReasonPlaceholder", "Explain the issue in detail...")}
          />
          <p className="text-xs text-text-muted mt-2">
            {t("contracts.disputeNotice", "Once a dispute is opened, the contract will be paused, and a moderator will review the case.")}
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
            disabled={isLoading}
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t("contracts.submitDispute", "Submit Dispute")
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateDisputeModal;
