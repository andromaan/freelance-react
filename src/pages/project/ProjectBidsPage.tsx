import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetBidsByProjectQuery } from "../../services/bids/bidsApi";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import {
  useGetAverageRatingQuery,
  useGetReviewsByEmailQuery,
} from "../../services/reviews/reviewsApi";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import type { BidVM } from "../../types/bid.types";
import { userImageUrl } from "../../utils";
import ArrowIcon from "../../components/icons/ArrowIcon";

/* ─── SenderInfo ─────────────────────────────────────────────────────────── */
interface SenderInfoProps {
  createdBy: string;
}

const SenderInfo: React.FC<SenderInfoProps> = ({ createdBy }) => {
  const { data: user, isLoading } = useGetUserByIdQuery(createdBy);

  const email = user?.email || "";
  const { data: averageRating = 0 } = useGetAverageRatingQuery(email, {
    skip: !email,
  });
  const { data: reviews = [] } = useGetReviewsByEmailQuery(email, {
    skip: !email,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 mt-4">
        <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const label = user.displayName ?? user.email;
  const initial = label.charAt(0).toUpperCase();

  return (
    <Link
      to={`/freelancers/${createdBy}`}
      className="flex items-center gap-4 mt-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
    >
      <div className="relative flex-shrink-0">
        {user.avatarImg ? (
          <img
            src={userImageUrl(user.avatarImg)}
            alt={user.displayName || "Avatar"}
            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white dark:border-gray-700">
            {initial}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors flex items-center gap-1">
            {user.displayName || user.email}
            <svg
              className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </span>

          <div className="flex items-center gap-1 text-xs">
            <svg
              className="w-3.5 h-3.5 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {averageRating > 0 ? averageRating.toFixed(1) : "No rating yet"}
            </span>
            <span className="text-gray-400 dark:text-gray-500">
              ({reviews.length})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-text-muted line-clamp-1">
            {user.email}
          </span>
          {user.country?.name && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {user.country.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ─── BidCard ────────────────────────────────────────────────────────────── */
interface BidCardProps {
  bid: BidVM;
}

const BidCard: React.FC<BidCardProps> = ({ bid }) => {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="text-2xl font-bold text-primary">
          ${bid.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap pt-1">
          {new Date(bid.modifiedAt).toLocaleDateString("uk-UA")}
        </span>
      </div>

      <p className="mt-3 text-sm text-text-muted leading-relaxed">
        {bid.message}
      </p>

      <SenderInfo createdBy={bid.createdBy} />
    </div>
  );
};

/* ─── Skeleton card ──────────────────────────────────────────────────────── */
const SkeletonCard: React.FC = () => (
  <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="h-7 w-28 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="mt-3 space-y-2">
      <div className="h-3 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-5/6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-4/6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="flex items-center gap-3 mt-4">
      <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
const ProjectBidsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(
    projectId!,
  );
  const { data: bids = [], isLoading: bidsLoading } = useGetBidsByProjectQuery(
    projectId!,
    {
      skip: !projectId,
    },
  );

  const isLoading = bidsLoading;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main pb-12 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-6"
        >
          <ArrowIcon direction="left" />
          Back to Project
        </button>

        {/* Header */}
        <div className="mb-8">
          {projectLoading ? (
            <div className="h-8 w-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          ) : (
            <h1 className="text-2xl font-bold text-text-main">
              Project: {project?.title}
            </h1>
          )}
          <p className="text-sm text-text-muted mt-1">
            Bids — {isLoading ? 0 : bids.length} total
          </p>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : bids.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 dark:text-gray-500 text-base">
              No bids received yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bids.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBidsPage;
