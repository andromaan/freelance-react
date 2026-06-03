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
import { userImageUrl } from "../../utils";
import PageError from "../../components/ui/PageError";
import ArrowIcon from "../../components/icons/ArrowIcon";

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
        message="This profile might be incomplete or does not exist."
        backToLabel="Go Back"
        backToPath="-1"
      />
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
    <div className="min-h-[calc(100vh-64px)] bg-main py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-2"
        >
          <ArrowIcon direction="left" />
          Back
        </button>

        {/* Header Section */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm mt-12 sm:mt-16">
          <div className="relative flex flex-col sm:flex-row gap-6 sm:items-end">
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

            <div className="flex-1 pb-2 mt-2 sm:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
                {user.displayName || user.email}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-muted">
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
                  <span className="font-semibold text-text-main">
                    {averageRating > 0
                      ? averageRating.toFixed(1)
                      : "No rating yet"}
                  </span>
                  <span className="text-text-muted">
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
                  <span className="font-semibold text-text-main">
                    {completedContractsCount}
                  </span>
                  <span className="text-text-muted">
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
            <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text-main mb-4 border-b border-border-light pb-2">
                About
              </h2>
              <p className="text-text-muted leading-relaxed whitespace-pre-line">
                {freelancer.bio || "No bio provided."}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-border-light pb-2">
                <h2 className="text-lg font-bold text-text-main">
                  Recent Reviews
                </h2>
                <span className="text-sm text-text-muted font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
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
                  <p className="text-text-muted">
                    No reviews yet.
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
                Skills
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
                  No skills added.
                </p>
              )}
            </div>

            {/* Languages */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text-main mb-4 border-b border-border-light pb-2">
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
                  No languages specified.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-6 border-b border-border-light pb-2">
            Portfolio & Projects
          </h2>
          {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {freelancer.portfolio.map((item, idx) => {
                const gradients = [
                  "from-blue-500 to-indigo-500",
                  "from-emerald-400 to-cyan-500",
                  "from-violet-500 to-fuchsia-500",
                  "from-amber-400 to-orange-500",
                  "from-pink-500 to-rose-500",
                ];
                const gradient = gradients[idx % gradients.length];
                const urlStr = item.portfolioUrl?.toLowerCase() || "";
                const isGithub = urlStr.includes("github.com");
                const isDribbble = urlStr.includes("dribbble.com");

                return (
                  <a
                    key={item.id}
                    href={item.portfolioUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`pl-4 h-16 w-full bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-start relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/10"></div>
                      {isGithub ? (
                        <svg
                          className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform relative z-10"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : isDribbble ? (
                        <svg
                          className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform relative z-10"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.156-.13-.316-.2-.476-1.328-3.143-2.825-5.992-2.868-6.071l-.019-.033A8.47 8.47 0 0118.605 6.61zM12 3.5c2.316 0 4.417.93 5.948 2.443-.092.164-1.378 2.435-2.73 5.485-3.003-1.285-6.196-1.579-6.398-1.596-.062-.004-.131-.01-.197-.01-.062 0-.127 0-.192.002C8.361 9.426 8.272 9.06 8.169 8.675 6.945 4.103 4.606 1.821 4.545 1.761 6.551 1.018 8.877 1.018 10.883 1.761c.061.06 2.4 2.342 3.624 6.914zM3.5 12c0-1.077.2-2.106.565-3.064.218.156 3.193 2.193 4.428 6.223a31.396 31.396 0 00-4.887 2.115A8.468 8.468 0 013.5 12zm8.5 8.5c-2.072 0-3.97-.74-5.454-1.97.106-.051 2.223-1.01 4.962-1.996 1.353 3.681 1.956 7.155 1.99 7.375C12.983 20.354 12.497 20.5 12 20.5zm6.536-2.505a8.483 8.483 0 01-4.086 2.32c-.08-.544-.658-3.94-1.928-7.513 2.825-.333 5.568.18 5.867.24a8.476 8.476 0 01.147 4.953z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform relative z-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors line-clamp-1 mb-2">
                        {item.title}
                      </h4>
                      {item.description ? (
                        <p className="text-sm text-text-muted line-clamp-2 mb-4 flex-1">
                          {item.description}
                        </p>
                      ) : (
                        <div className="flex-1"></div>
                      )}
                      {item.portfolioUrl && (
                        <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
                          <span>View Link</span>
                          <ArrowIcon direction="right" />
                        </div>
                      )}
                    </div>
                  </a>
                );
              })}
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
                Portfolio is empty
              </h3>
              <p className="text-sm text-text-muted max-w-sm mx-auto">
                This freelancer hasn't added any projects to their portfolio
                yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilePage;
