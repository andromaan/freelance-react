import React from "react";
import { useGetProjectByContractIdQuery } from "../../../services/projects/projectsApi";
import { useGetUserByIdQuery } from "../../../services/user/userApi";
import type { ReviewVM } from "../../../types/review.types";
import { userImageUrl } from "../../../utils";
import { Link } from "react-router-dom";

interface ReviewCardProps {
  review: ReviewVM;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
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
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
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
        <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  const employerInitial = employer?.displayName
    ? employer.displayName.charAt(0).toUpperCase()
    : employer?.email?.charAt(0).toUpperCase() || "?";

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full">
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
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-1">
          {project.title}
        </h4>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4 flex-1">
        "{review.reviewText || "No written review provided."}"
      </p>

      {/* Employer Info */}
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
        <div className=" pt-3 mt-auto flex items-center gap-2">
          {employer?.avatarImg ? (
            <img
              src={userImageUrl(employer.avatarImg)}
              alt={employer.displayName || "Employer Avatar"}
              className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center border border-primary/20">
              {employerInitial}
            </div>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {employer?.displayName || employer?.email || "Unknown Employer"}
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
            View Project
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
