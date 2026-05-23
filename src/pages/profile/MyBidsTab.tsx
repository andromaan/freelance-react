import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteBidMutation,
  useGetBidsByFreelancerQuery,
} from "../../services/bids/bidsApi";
import type { BidVM } from "../../types/bid.types";
import ConfirmModal from "../../components/ui/ConfirmModal";
import DeleteIcon from "../../components/icons/DeleteIcon";
import { useGetQuotesByFreelancerQuery } from "../../services/quotes/quotesApi";

const InterestBadge: React.FC<{ value?: boolean | null }> = ({ value }) => {
  if (value === true)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Interesting
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Not Interesting
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Pending
    </span>
  );
};

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
      return bids.filter(
        (b) => b.isInteresting === null || b.isInteresting === undefined,
      );
    case "interesting":
      return bids.filter((b) => b.isInteresting === true);
    case "not-interesting":
      return bids.filter((b) => b.isInteresting === false);
    default:
      return bids;
  }
}

// ─── Bid card ─────────────────────────────────────────────────────────────────

interface BidCardProps {
  bid: BidVM;
  onSubmitQuote: (bid: BidVM) => void;
  onEditBid: (bid: BidVM) => void;
  onDeleteBid: (bid: BidVM) => void;
  isQuoteSubmitted?: boolean;
}

const BidCard: React.FC<BidCardProps> = ({
  bid,
  onSubmitQuote,
  onEditBid,
  onDeleteBid,
  isQuoteSubmitted,
}) => (
  <article className="shadow-lg bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3">
    {/* Top row */}
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <span className="text-xl font-bold text-primary tabular-nums">
          ${bid.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide font-medium">
          Submitted {new Date(bid.createdAt).toLocaleDateString("uk-UA")}
        </p>
      </div>
      <InterestBadge value={bid.isInteresting} />
    </div>

    {/* Message */}
    {bid.message && (
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
        {bid.message}
      </p>
    )}

    {/* Actions row */}
    <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 flex-wrap">
      {/* View project */}
      <Link
        to={`/projects/${bid.projectId}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
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

      <div className="ml-auto flex items-center gap-2">
        {/* Submit Quote CTA — only when employer marked interesting */}
        {bid.isInteresting === true ? (
          !isQuoteSubmitted ? (
            <button
              type="button"
              onClick={() => onSubmitQuote(bid)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                       bg-primary hover:bg-primary-hover text-white
                       transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                       shadow-sm hover:shadow-md"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Submit Quote
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
             bg-green-600 text-white opacity-70 cursor-not-allowed
             transition-colors shadow-sm"
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
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Quote Submitted
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={() => onEditBid(bid)}
            className="p-2 rounded-lg text-gray-400 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
            title="Edit Bid"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDeleteBid(bid)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
          title="Delete"
        >
          <DeleteIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  </article>
);

// ─── Skeleton bid card ────────────────────────────────────────────────────────

const SkeletonBidCard: React.FC = () => (
  <div className="shadow-lg bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1.5">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
    <div className="space-y-1.5">
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

interface MyBidsTabProps {
  onSubmitQuote: (bid: BidVM) => void;
  onEditBid: (bid: BidVM) => void;
}

const MyBidsTab: React.FC<MyBidsTabProps> = ({ onSubmitQuote, onEditBid }) => {
  const { data: bids = [], isLoading } = useGetBidsByFreelancerQuery();
  const [deleteBid, { isLoading: isDeleting }] = useDeleteBidMutation();
  const [filter, setFilter] = useState<InterestFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<BidVM | null>(null);

  const { data: quotes = [] } = useGetQuotesByFreelancerQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <SkeletonBidCard />
        <SkeletonBidCard />
        <SkeletonBidCard />
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          No bids yet
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Browse projects and place your first bid.
        </p>
        <Link
          to="/projects"
          className="mt-4 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
        >
          Browse Projects
        </Link>
      </div>
    );
  }

  const counts: Record<InterestFilter, number> = {
    all: bids.length,
    pending: bids.filter(
      (b) => b.isInteresting === null || b.isInteresting === undefined,
    ).length,
    interesting: bids.filter((b) => b.isInteresting === true).length,
    "not-interesting": bids.filter((b) => b.isInteresting === false).length,
  };

  const filtered = filterBids(bids, filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter bids by interest"
      >
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
              filter === key
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            {label}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${
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

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No bids match this filter.
          </p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-2 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Show all
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3" aria-label="My bids">
          {filtered.map((bid) => (
            <li key={bid.id}>
              <BidCard
                bid={bid}
                onSubmitQuote={onSubmitQuote}
                onEditBid={onEditBid}
                onDeleteBid={setDeleteTarget}
                isQuoteSubmitted={quotes.some(
                  (q) => q.projectId === bid.projectId,
                )}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteBid(deleteTarget.id).unwrap();
          } catch {
            // Error is handled by toast in API
          }
          setDeleteTarget(null);
        }}
        title="Delete Bid?"
        description={
          <>
            Are you sure you want to delete this bid for{" "}
            <strong>
              $
              {deleteTarget?.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </strong>
            ?
            <br />
            This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MyBidsTab;
