import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import {
  useGetBidsByProjectQuery,
  useUpdateBidIsInterestMutation,
} from "../../services/bids/bidsApi";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import ConfirmModal from "../../components/ui/ConfirmModal";
import type { BidVM } from "../../types/bid.types";

// ─── Filter ───────────────────────────────────────────────────────────────────

type InterestFilter = "all" | "pending" | "interesting" | "not-interesting";

const FILTER_TABS: { key: InterestFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "interesting", label: "Interesting" },
  { key: "not-interesting", label: "Not Interesting" },
];

function filterBids(bids: BidVM[], filter: InterestFilter): BidVM[] {
  switch (filter) {
    case "pending":
      return bids.filter((b) => b.isInteresting === null || b.isInteresting === undefined);
    case "interesting":
      return bids.filter((b) => b.isInteresting === true);
    case "not-interesting":
      return bids.filter((b) => b.isInteresting === false);
    default:
      return bids;
  }
}

// ─── Interest badge ───────────────────────────────────────────────────────────

const InterestBadge: React.FC<{ value?: boolean | null }> = ({ value }) => {
  if (value === true)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        Interesting
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Not Interesting
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Pending
    </span>
  );
};

// ─── SenderInfo ───────────────────────────────────────────────────────────────

const SenderInfo: React.FC<{ createdBy: string }> = ({ createdBy }) => {
  const { data: user, isLoading } = useGetUserByIdQuery(createdBy);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const label = user.displayName ?? user.email;
  const initial = label.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0 uppercase">
        {initial}
      </div>
      <div className="flex flex-col min-w-0">
        {user.displayName && (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {user.displayName}
          </span>
        )}
        <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</span>
        {user.country?.name && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{user.country.name}</span>
        )}
      </div>
    </div>
  );
};

// ─── BidCard ──────────────────────────────────────────────────────────────────

interface BidCardProps {
  bid: BidVM;
  onMark: (bidId: string, value: boolean) => void;
  isUpdating: boolean;
}

const BidCard: React.FC<BidCardProps> = ({ bid, onMark, isUpdating }) => (
  <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
    {/* Top row: amount + date + badge */}
    <div className="flex items-start justify-between gap-4 mb-3">
      <div>
        <span className="text-2xl font-bold text-primary tabular-nums">
          ${bid.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide font-medium">
          {new Date(bid.modifiedAt).toLocaleDateString("uk-UA")}
        </p>
        </span>
      </div>
      <InterestBadge value={bid.isInteresting} />
    </div>

    {/* Message */}
    {bid.message && (
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
        {bid.message}
      </p>
    )}

    {/* Sender */}
    <SenderInfo createdBy={bid.createdBy} />

    {/* Action buttons */}
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <button
        type="button"
        disabled={isUpdating || bid.isInteresting === true}
        onClick={() => onMark(bid.id, true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-emerald-50 text-emerald-700 hover:bg-emerald-100
                   dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20
                   disabled:opacity-40 disabled:cursor-not-allowed
                   border border-emerald-200 dark:border-emerald-500/20
                   transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
      >
        {isUpdating ? (
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
        Interesting
      </button>

      <button
        type="button"
        disabled={isUpdating || bid.isInteresting === false}
        onClick={() => onMark(bid.id, false)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-red-50 text-red-600 hover:bg-red-100
                   dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20
                   disabled:opacity-40 disabled:cursor-not-allowed
                   border border-red-200 dark:border-red-500/20
                   transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Not Interesting
      </button>
    </div>
  </article>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 animate-pulse">
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="space-y-1.5">
        <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-1.5 flex-1">
        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const MyProjectBidsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // ── API ──────────────────────────────────────────────────────────────────
  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(projectId!);
  const { data: bids = [], isLoading: bidsLoading } = useGetBidsByProjectQuery(
    projectId!,
    { skip: !projectId },
  );
  const [updateInterest, { isLoading: isUpdating }] = useUpdateBidIsInterestMutation();

  // ── Local state ───────────────────────────────────────────────────────────
  const [filter, setFilter] = useState<InterestFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingMark, setPendingMark] = useState<{ bidId: string; value: boolean } | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleMark = (bidId: string, value: boolean) => {
    setPendingMark({ bidId, value });
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingMark) return;
    setConfirmOpen(false);
    setUpdatingId(pendingMark.bidId);
    try {
      await updateInterest({ bidId: pendingMark.bidId, isInteresting: pendingMark.value }).unwrap();
    } finally {
      setUpdatingId(null);
      setPendingMark(null);
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setPendingMark(null);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = filterBids(bids, filter);

  const counts: Record<InterestFilter, number> = {
    all: bids.length,
    pending: bids.filter((b) => b.isInteresting === null || b.isInteresting === undefined).length,
    interesting: bids.filter((b) => b.isInteresting === true).length,
    "not-interesting": bids.filter((b) => b.isInteresting === false).length,
  };

  const confirmTitle = pendingMark?.value ? "Mark as Interesting" : "Mark as Not Interesting";
  const confirmDescription = pendingMark?.value
    ? "Mark this bid as interesting? The freelancer will be notified."
    : "Mark this bid as not interesting? The freelancer will be notified.";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 pb-12 pt-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(`/my-projects/${projectId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Project
        </button>

        {/* Header */}
        <div className="mb-6">
          {projectLoading ? (
            <div className="h-8 w-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
              {project?.title ?? "Project"}
            </h1>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Bids —{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {bidsLoading ? "…" : bids.length} total
            </span>
          </p>
        </div>

        {/* Filter tabs */}
        {!bidsLoading && bids.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter bids by interest">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                  filter === key
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {label}
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${
                    filter === key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {bidsLoading ? (
          <div className="flex flex-col gap-4" aria-busy="true">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {filter === "all" ? "No bids received yet." : "No bids match the selected filter."}
            </p>
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-3 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
              >
                Show all bids
              </button>
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-4" aria-label="List of bids">
            {filtered.map((bid) => (
              <li key={bid.id}>
                <BidCard
                  bid={bid}
                  onMark={handleMark}
                  isUpdating={updatingId === bid.id && isUpdating}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={pendingMark?.value ? "Interesting" : "Not Interesting"}
        cancelLabel="Cancel"
        isLoading={isUpdating}
      />
    </div>
  );
};

export default MyProjectBidsPage;
