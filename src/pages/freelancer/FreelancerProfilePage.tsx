import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import { useGetFreelancerByEmailQuery } from "../../services/freelancer/freelancerApi";
import {
  useGetReviewsByEmailQuery,
  useGetAverageRatingQuery,
} from "../../services/reviews/reviewsApi";
import { useGetLanguagesQuery } from "../../services/languages/languagesApi";
import { useGetCompletedContractsByFreelancerQuery } from "../../services/contracts/contractsApi";
import ReviewCard from "./components/ReviewCard";
import APP_ENV from "../../env";

const FreelancerProfilePage: React.FC = () => {
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Freelancer Not Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          This profile might be incomplete or does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const avatarLetters = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : (user.email?.slice(0, 2).toUpperCase() ?? "??");

  const countryText = user.country?.name ?? "Location not specified";

  const latestReviews = [...reviews]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 3); // Showing 3 latest

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm mt-12 sm:mt-16">
          <div className="relative flex flex-col sm:flex-row gap-6 sm:items-end">
            <div className="relative shrink-0 -mt-16 sm:-mt-20">
              {user.avatarImg ? (
                <img
                  src={`${APP_ENV.API_URL}/${user.avatarImg}`}
                  alt={user.displayName || "Avatar"}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md bg-white dark:bg-gray-800"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-primary text-white text-3xl font-bold flex items-center justify-center shadow-md">
                  {avatarLetters}
                </div>
              )}
            </div>

            <div className="flex-1 pb-2 mt-2 sm:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {user.displayName || user.email}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-300">
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
                  title={`${averageRating} average rating`}
                >
                  <svg
                    className="w-4 h-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {averageRating > 0 ? averageRating.toFixed(1) : "New"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>

                <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                  •
                </span>

                {/* Completed Contracts */}
                <div
                  className="flex items-center gap-1.5"
                  title={`${completedContractsCount} completed contracts`}
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
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {completedContractsCount}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    completed{" "}
                    {completedContractsCount === 1 ? "contract" : "contracts"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                About
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {freelancer.bio || "No bio provided."}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Reviews
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {reviews.length} total
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
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No reviews yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                Skills
              </h2>
              {freelancer.skills && freelancer.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No skills added.
                </p>
              )}
            </div>

            {/* Languages */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                Languages
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
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {langName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                          {lang.proficiencyLevel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No languages specified.
                </p>
              )}
            </div>

            {/* Portfolio */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                Portfolio
              </h2>
              {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
                <div className="space-y-4">
                  {freelancer.portfolio.map((item) => (
                    <a
                      key={item.id}
                      href={item.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all group"
                    >
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View Project
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Portfolio is empty.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilePage;
