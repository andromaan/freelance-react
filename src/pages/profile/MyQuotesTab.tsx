import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteQuoteMutation, useGetQuotesByFreelancerQuery } from "../../services/quotes/quotesApi";
import { useIsExistsByQuoteQuery } from "../../services/contracts/contractsApi";
import type { QuoteVM } from "../../types/quote.types";
import ConfirmModal from "../../components/ui/ConfirmModal";
import DeleteIcon from "../../components/icons/DeleteIcon";

// ─── Quote card ─────────────────────────────────────────────────────────────────

interface QuoteCardProps {
  quote: QuoteVM;
  onEditQuote: (quote: QuoteVM) => void;
  onDeleteQuote: (quote: QuoteVM) => void;
}

const ContractStatus: React.FC<{ quoteId: string }> = ({ quoteId }) => {
  const { data: exists } = useIsExistsByQuoteQuery(quoteId, {
    refetchOnMountOrArgChange: true,
  });

  if (!exists) return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold
                 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      Contracted
    </span>
  );
};

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onEditQuote, onDeleteQuote }) => (
  <article className="shadow-lg bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3">
    {/* Top row */}
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <span className="text-xl font-bold text-green-500 tabular-nums">
          ${quote.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide font-medium">
          Submitted {new Date(quote.createdAt).toLocaleDateString("uk-UA")}
        </p>
      </div>
      <ContractStatus quoteId={quote.id} />
    </div>

    {/* Message */}
    {quote.message && (
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
        {quote.message}
      </p>
    )}

    {/* Actions row */}
    <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 flex-wrap">
      {/* View project */}
      <Link
        to={`/projects/${quote.projectId}`}
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

      <div className="ml-auto flex items-center gap-1">
        {/* Edit Quote button */}
        <button
          type="button"
          onClick={() => onEditQuote(quote)}
          className="p-2 rounded-lg text-gray-400 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
          title="Edit Quote"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDeleteQuote(quote)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
          title="Delete"
        >
          <DeleteIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  </article>
);

// ─── Skeleton quote card ───────────────────────────────────────────────────────

const SkeletonQuoteCard: React.FC = () => (
  <div className="shadow-lg bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1.5">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
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

// ─── Props ──────────────────────────────────────────────────────────────────────

interface MyQuotesTabProps {
  onEditQuote: (quote: QuoteVM) => void;
}

// ─── Main component ─────────────────────────────────────────────────────────────

const MyQuotesTab: React.FC<MyQuotesTabProps> = ({ onEditQuote }) => {
  const { data: quotes = [], isLoading } = useGetQuotesByFreelancerQuery();
  const [deleteQuote, { isLoading: isDeleting }] = useDeleteQuoteMutation();
  const [deleteTarget, setDeleteTarget] = useState<QuoteVM | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <SkeletonQuoteCard />
        <SkeletonQuoteCard />
        <SkeletonQuoteCard />
      </div>
    );
  }

  if (quotes.length === 0) {
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z"
            />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          No quotes yet
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Browse projects and submit your first quote.
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

  return (
    <div className="flex flex-col gap-3" aria-label="My quotes">
      {quotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          onEditQuote={onEditQuote}
          onDeleteQuote={setDeleteTarget}
        />
      ))}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteQuote(deleteTarget.id).unwrap();
          } catch {
            // Error is handled by toast in API
          }
          setDeleteTarget(null);
        }}
        title="Delete Quote?"
        description={
          <>
            Are you sure you want to delete this quote for{" "}
            <strong>${deleteTarget?.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>?
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

export default MyQuotesTab;
