import React from "react";
import { useGetProjectByContractIdQuery } from "../../../services/projects/projectsApi";
import { useGetUserByIdQuery } from "../../../services/user/userApi";
import type { ReviewVM } from "../../../types/review.types";
import { avatarLetters, userImageUrl } from "../../../utils";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";

interface ReviewCardProps {
  review: ReviewVM;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const { theme } = useTheme();

  const isDark = theme == "dark";
  const starYellowColor = isDark ? "rgb(251 191 36)" : "rgb(233, 181, 62)"
  const starGrayColor = isDark ? "#8e9fb68b" : "rgb(209 213 219)"

  return (
    <div className="flex gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill =
          rating >= star ? "full" : rating >= star - 0.5 ? "half" : "empty";
        const gradientId = `star-half-${star}-${Math.random().toString(36).slice(2, 7)}`;

        return (
          <svg
            key={star}
            className="w-5 h-5"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {fill === "half" && (
              <defs>
                <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor={starYellowColor} />
                  <stop offset="50%" stopColor={starGrayColor} />
                </linearGradient>
              </defs>
            )}
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={
                fill === "full"
                  ? starYellowColor
                  : fill === "half"
                    ? `url(#${gradientId})`
                    : starGrayColor
              }
            />
          </svg>
        );
      })}
    </div>
  );
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { t } = useTranslation();
  // Fetch the project to get title and categories
  const { data: project, isLoading: isProjectLoading } =
    useGetProjectByContractIdQuery(review.contractId);

  // Fetch Employer who left the review
  const { data: employer, isLoading: isEmployerLoading } = useGetUserByIdQuery(
    review.reviewerId,
  );

  const isLoading = isProjectLoading || isEmployerLoading;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl p-5 border border-border-light shadow-sm animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
            ))}
          </div>
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-4" />
        <div className="flex items-center gap-2 border-t border-border-light pt-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <article className="bg-surface rounded-xl p-5 border border-border-light shadow-sm flex flex-col h-full">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <StarRating rating={review.rating} />

        {/* Project Categories */}
        {project?.categories && project.categories.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-end">
            {project.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {cat.name}
              </span>
            ))}
            {project.categories.length > 2 && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                +{project.categories.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {project?.title && (
        <h4 className="font-semibold text-text-main text-sm mb-2 line-clamp-1">
          {project.title}
        </h4>
      )}

      <p className="text-sm text-text-muted italic mb-4 flex-1">
        "{review.reviewText || t("freelancerProfile.noReviewText")}"
      </p>

      {/* Employer Info */}
      <div className="flex items-center justify-between border-t border-border-light">
        <div className=" pt-3 mt-auto flex items-center gap-2">
          {employer?.avatarImg ? (
            <img
              src={userImageUrl(employer.avatarImg)}
              alt={employer.displayName || "Employer Avatar"}
              className="w-6 h-6 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center border border-primary/20">
              {avatarLetters(employer)}
            </div>
          )}
          <span className="text-xs text-text-muted font-medium">
            {employer?.displayName ||
              employer?.email ||
              t("freelancerProfile.unknownEmployer")}
          </span>
        </div>

        <div className="flex">
          <Link
            to={`/projects/${project?.id}`}
            className="text-xs text-primary mt-1 inline-block flex gap-1 items-center"
          >
            <svg
              className="w-3.5 h-3.5"
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
            {t("freelancerProfile.viewProject")}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
