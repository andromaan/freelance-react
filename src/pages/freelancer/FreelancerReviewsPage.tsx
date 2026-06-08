import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import { useGetReviewsByEmailQuery, useGetAverageRatingQuery } from "../../services/reviews/reviewsApi";
import ReviewCard from "./components/ReviewCard";
import PageError from "../../components/ui/PageError";
import PageLoading from "../../components/ui/PageLoading";
import ArrowIcon from "../../components/icons/ArrowIcon";

const FreelancerReviewsPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(userId!);
  const email = user?.email || "";

  const { data: reviews = [], isLoading: isReviewsLoading } =
    useGetReviewsByEmailQuery(email, {
      skip: !email,
    });

  const { data: averageRating = 0, isLoading: isRatingLoading } =
    useGetAverageRatingQuery(email, {
      skip: !email,
    });

  const isLoading = isUserLoading || isReviewsLoading || isRatingLoading;

  if (isLoading) {
    return <PageLoading message={t("freelancerProfile.loadingReviews", "Loading reviews...")} />;
  }

  if (!user) {
    return (
      <PageError
        message={t("freelancerProfile.incomplete")}
        backToLabel={t("freelancerProfile.goBack")}
        backToPath="-1"
      />
    );
  }

  const sortedReviews = [...reviews].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-4"
        >
          <ArrowIcon direction="left" />
          <span>{t("freelancerProfile.goBack")}</span>
        </button>

        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-border-light gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-main mb-1">
                {t("freelancerProfile.reviewsFor", "Reviews for")} {user.displayName || user.email}
              </h1>
              <p className="text-sm text-text-muted">
                {reviews.length} {t("freelancerProfile.total")}
              </p>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-4 py-2 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>

          {sortedReviews.length > 0 ? (
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-border bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-base font-semibold text-text-main mb-1">
                {t("freelancerProfile.noReviews")}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerReviewsPage;
