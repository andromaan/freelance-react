import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { toast } from "react-toastify";
import { useCreateReviewMutation } from "../../../services/reviews/reviewsApi";

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  isOpen,
  onClose,
  contractId,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleCreate = async () => {
    if (rating < 0.5) {
      toast.error(t("contracts.review.minRating"));
      return;
    }

    try {
      await createReview({
        contractId,
        rating,
        reviewText,
      }).unwrap();

      toast.success(t("contracts.review.success"));
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.title || error?.data?.message || t("contracts.review.fail"));
    }
  };

  const calculateStars = (index: number) => {
    const value = index + 1;
    const currentRating = hoverRating || rating;
    if (currentRating >= value) return 1;
    if (currentRating >= value - 0.5) return 0.5;
    return 0;
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - left < width / 2;
    setHoverRating(index + (isHalf ? 0.5 : 1));
  };

  const StarIcon = ({ value }: { value: number }) => {
    if (value === 1) {
      return (
        <svg
          className="w-8 h-8 text-yellow-500 drop-shadow-sm"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (value === 0.5) {
      return (
        <svg
          className="w-8 h-8 text-yellow-500 drop-shadow-sm"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
            <linearGradient id="half-star-dark" x1="0" x2="100%" y1="0" y2="0">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#4B5563" />
            </linearGradient>
          </defs>
          <path
            className="dark:hidden"
            fill="url(#half-star)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
          <path
            className="hidden dark:block"
            fill="url(#half-star-dark)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-8 h-8 text-gray-200 dark:text-gray-600 drop-shadow-sm"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t("contracts.review.title")}>
      <div className="space-y-6 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("contracts.review.rate")}</label>
          <div
            className="flex gap-1 items-center"
            onMouseLeave={() => setHoverRating(0)}
          >
            {Array.from({ length: 5 }).map((_, index) => {
              const starValue = calculateStars(index);
              return (
                <div
                  key={index}
                  className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onClick={() => setRating(hoverRating)}
                >
                  <StarIcon value={starValue} />
                </div>
              );
            })}
            <span className="ml-3 text-lg text-text-muted font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
              {(hoverRating || rating).toFixed(1)} / 5.0
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("contracts.review.optionalText")}</label>
          <textarea
            id="reviewText"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-main transition-all resize-none shadow-sm"
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t("contracts.review.placeholder")}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t border-border-light pt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 border border-border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
          >{t("common.cancel")}</button>
          <button
            onClick={handleCreate}
            disabled={isLoading || rating < 0.5}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-hover shadow-sm shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {isLoading ? t("contracts.review.saving") : t("contracts.review.submit")}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateReviewModal;
