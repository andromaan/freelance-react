import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import { useGetFreelancerByEmailQuery } from "../../services/freelancer/freelancerApi";
import {
  useGetReviewsByEmailQuery,
  useGetAverageRatingQuery,
} from "../../services/reviews/reviewsApi";
import { useGetLanguagesQuery } from "../../services/languages/languagesApi";
import { useGetCompletedContractsByFreelancerQuery } from "../../services/contracts/contractsApi";
import ReviewCard from "./components/ReviewCard";
import { userImageUrl } from "../../utils";
import PageError from "../../components/ui/PageError";
import ArrowIcon from "../../components/icons/ArrowIcon";
import PortfolioCard from "./components/PortfolioCard";
import { useTranslation } from "react-i18next";

const FreelancerProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // 1. Fetch User
  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(userId!);

  // Fetch Languages dictionary
  const { data: languagesList } = useGetLanguagesQuery();

  const email = user?.email || "";

  // 2. Fetch Freelancer details by email
  const { data: freelancer, isLoading: isFreelancerLoading } =
    useGetFreelancerByEmailQuery(email, {
      skip: !email,
    });

  // 3. Fetch Reviews & Rating (requires user email)
  const { data: reviews = [], isLoading: isReviewsLoading } =
    useGetReviewsByEmailQuery(email, {
      skip: !email,
    });
  const { data: averageRating = 0, isLoading: isRatingLoading } =
    useGetAverageRatingQuery(email, {
      skip: !email,
    });

  // 4. Fetch Completed Contracts
  const {
    data: completedContracts = [],
    isLoading: isCompletedContractsLoading,
  } = useGetCompletedContractsByFreelancerQuery(freelancer?.id || "", {
    skip: !freelancer?.id,
  });

  const completedContractsCount = completedContracts.length;

  const isLoading =
    isUserLoading ||
    isFreelancerLoading ||
    isRatingLoading ||
    isCompletedContractsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
          <div className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user || !freelancer) {
    return (
      <PageError
        message={t("freelancerProfile.incomplete")}
        backToLabel={t("freelancerProfile.goBack")}
        backToPath="-1"
      />
    );
  }

  const avatarLetters = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : (user.email?.slice(0, 2).toUpperCase() ?? "??");

  const countryText = user.country?.name ?? t("freelancerProfile.noLocation");

  const latestReviews = [...reviews]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 3); // Showing 3 latest

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-2"
        >
          <ArrowIcon direction="left" />
          {t("freelancerProfile.back")}
        </button>

        {/* Header Section */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm mt-12 sm:mt-16">
          <div className="relative flex flex-col items-center text-center sm:text-left sm:flex-row gap-4 sm:gap-6 sm:items-end">
            <div className="relative shrink-0 -mt-16 sm:-mt-20">
              {user.avatarImg ? (
                <img
                  src={userImageUrl(user.avatarImg)}
                  alt={user.displayName || "Avatar"}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md bg-surface"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-primary text-white text-3xl font-bold flex items-center justify-center shadow-md">
                  {avatarLetters}
                </div>
              )}
            </div>

            <div className="flex-1 pb-2 mt-2 sm:mt-0 flex flex-col items-center sm:items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
                {user.displayName || user.email}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    {freelancer.location
                      ? `${freelancer.location}, ${countryText}`
                      : countryText}
                  </span>
                </span>

                <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                  •
                </span>

                {/* Rating */}
                <div
                  className="flex items-center gap-1.5"
                  title={`${averageRating} ${t("freelancerProfile.averageRating")}`}
                >
                  <svg
                    className="w-4 h-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-text-main">
                    {averageRating > 0
                      ? averageRating.toFixed(1)
                      : t("freelancerProfile.noRating")}
                  </span>
                  <span className="text-text-muted">
                    ({reviews.length} {reviews.length !== 1 ? t("freelancerProfile.reviews") : t("freelancerProfile.review")})
                  </span>
                </div>

                <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                  •
                </span>

                {/* Completed Contracts */}
                <div
                  className="flex items-center gap-1.5"
                  title={`${completedContractsCount} ${t("freelancerProfile.completedContractsTitle")}`}
                >
                  <svg
                    className="w-4 h-4 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold text-text-main">
                    {completedContractsCount}
                  </span>
                  <span className="text-text-muted">
                    {t("freelancerProfile.completed")}{" "}
                    {completedContractsCount === 1 ? t("freelancerProfile.contract") : t("freelancerProfile.contracts")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text-main mb-4 border-b border-border-light pb-2">
                {t("freelancerProfile.about")}
              </h2>
              <p className="text-text-muted leading-relaxed whitespace-pre-line">
                {freelancer.bio || t("freelancerProfile.noBio")}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-border-light pb-2">
                <h2 className="text-lg font-bold text-text-main">
                  {t("freelancerProfile.recentReviews")}
                </h2>
                <span className="text-sm text-text-muted font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {reviews.length} {t("freelancerProfile.total")}
                </span>
              </div>

              {isReviewsLoading ? (
                <div className="space-y-4">
                  <div className="h-24 bg-gray-100 dark:bg-gray-700/50 animate-pulse rounded-xl" />
                  <div className="h-24 bg-gray-100 dark:bg-gray-700/50 animate-pulse rounded-xl" />
                </div>
              ) : latestReviews.length > 0 ? (
                <div className="space-y-4">
                  {latestReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.length > 3 && (
                    <div className="text-center">
                      <Link
                        to={`/freelancers/${userId}/reviews`}
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-medium text-sm transition-colors"
                      >
                        {t("freelancerProfile.seeAllReviews", "See all reviews")}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-muted">
                    {t("freelancerProfile.noReviews")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text-main mb-4 border-b border-border-light pb-2">
                {t("freelancerProfile.skills")}
              </h2>
              {freelancer.skills && freelancer.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-sm">
                  {t("freelancerProfile.noSkills")}
                </p>
              )}
            </div>

            {/* Languages */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text-main mb-4 border-b border-border-light pb-2">
                {t("freelancerProfile.languages")}
              </h2>
              {user.languages && user.languages.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {user.languages.map((lang) => {
                    const langName =
                      languagesList?.find((l) => l.id === lang.languageId)
                        ?.name || `Language ${lang.languageId}`;
                    return (
                      <div
                        key={lang.languageId}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-text-main">
                          {langName}
                        </span>
                        <span className="text-xs text-text-muted bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                          {lang.proficiencyLevel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-text-muted text-sm">
                  {t("freelancerProfile.noLanguages")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-border-light pb-2">
            <h2 className="text-lg font-bold text-text-main">
              {t("freelancerProfile.portfolio")}
            </h2>
            {freelancer.portfolio && freelancer.portfolio.length > 0 && (
              <span className="text-sm text-text-muted font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {freelancer.portfolio.length} {t("freelancerProfile.total", "total")}
              </span>
            )}
          </div>
          {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                {freelancer.portfolio.slice(0, 4).map((item, idx) => (
                  <PortfolioCard key={item.id} item={item} index={idx} clampDescription={true} />
                ))}
              </div>
              {freelancer.portfolio.length > 4 && (
                <div className="pt-4 text-center">
                  <Link
                    to={`/freelancers/${userId}/portfolio`}
                    className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-medium text-sm transition-colors"
                  >
                    {t("freelancerProfile.seeAllPortfolio", "See all portfolio & projects")}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-border bg-gray-50 dark:bg-gray-800/50">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface text-gray-400 shadow-sm border border-border-light mb-4">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text-main mb-1">
                {t("freelancerProfile.portfolioEmpty")}
              </h3>
              <p className="text-sm text-text-muted max-w-sm mx-auto">
                {t("freelancerProfile.portfolioEmptyDesc")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilePage;
