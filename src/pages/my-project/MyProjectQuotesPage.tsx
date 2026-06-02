import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import { useGetQuotesByProjectQuery } from "../../services/quotes/quotesApi";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import {
  useCreateContractMutation,
  useCanContractBeCreatedQuery,
} from "../../services/contracts/contractsApi";
import type { QuoteVM } from "../../types/quote.types";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { toast } from "react-toastify";
import ArrowIcon from "../../components/icons/ArrowIcon";

/* ─── Types ────────────────────────────────────────────────────────────── */
interface CreateContractPayload {
  quoteId: string;
  message: string;
}

/* ─── SenderInfo ─────────────────────────────────────────────────────────── */
interface SenderInfoProps {
  createdBy: string;
}

const SenderInfo: React.FC<SenderInfoProps> = ({ createdBy }) => {
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
        <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {user.email}
        </span>
        {user.country?.name && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {user.country.name}
          </span>
        )}
      </div>
    </div>
  );
};

/* ─── QuoteCard ──────────────────────────────────────────────────────────── */
interface QuoteCardProps {
  quote: QuoteVM;
  onCreateContract: (payload: CreateContractPayload) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onCreateContract }) => {
  const dateStr = new Date(quote.createdAt).toLocaleDateString("uk-UA");

  const {
    data: canContractBeCreated,
    isLoading: isChecking,
  } = useCanContractBeCreatedQuery(quote.id!, {
    skip: !quote.id,
  });

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-2xl font-bold text-green-500 tabular-nums">
            $
            {quote.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide font-medium">
            {dateStr}
          </p>
        </div>

        {/* CTA */}
        {isChecking ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Checking
          </span>
        ) : canContractBeCreated ? (
          <button
            type="button"
            onClick={() =>
              onCreateContract({ quoteId: quote.id, message: quote.message })
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg
                     bg-green-500 hover:bg-green-600 text-white
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 focus-visible:ring-offset-2
                     shadow-sm hover:shadow-md
                     transition-all duration-150"
          >
            Create contract
          </button>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 py-2 px-4 py-1.5 rounded-lg text-xs font-semibold
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
            Have contract
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
        {quote.message}
      </p>

      <SenderInfo createdBy={quote.createdBy} />
    </article>
  );
};

/* ─── Skeleton card ──────────────────────────────────────────────────────── */
const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 animate-pulse">
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="space-y-1.5">
        <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
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
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
const MyProjectQuotesPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(
    projectId!,
  );
  const { data: quotes = [], isLoading: quotesLoading } =
    useGetQuotesByProjectQuery(projectId!, {
      skip: !projectId,
    });

  const [createContract, { isLoading: createLoading }] =
    useCreateContractMutation();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] =
    useState<CreateContractPayload | null>(null);

  const handleCreateContract = async () => {
    if (selectedQuote) {
      try {
        await createContract(selectedQuote.quoteId).unwrap();
        setIsConfirmOpen(false);
        setSelectedQuote(null);
        // todo: navigate to contract page after creation
      } catch (err: any) {
        toast.error(
          "Error creating contract: " + (err?.data?.message || err.message),
        );
      }
    }
  };

  const isLoading = quotesLoading;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 pb-12 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(`/my-projects/${projectId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-6"
        >
          <ArrowIcon direction="left" />
          Back to Project
        </button>

        {/* Header */}
        <div className="mb-8">
          {projectLoading ? (
            <div className="h-8 w-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Project: {project?.title}
            </h1>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quotes — {isLoading ? 0 : quotes.length} total
          </p>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : quotes.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 dark:text-gray-500 text-base">
              No quotes received yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {quotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onCreateContract={(payload) => {
                  setSelectedQuote(payload);
                  setIsConfirmOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm contract creation */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedQuote(null);
        }}
        onConfirm={handleCreateContract}
        title="Create contract based on this quote?"
        description={
          selectedQuote ? (
            <>
              You are about to create a contract based on this quote. This
              action is irreversible.
              <br />
              <span className="mt-2 block text-xs text-gray-500 dark:text-gray-500">
                {selectedQuote.message}
              </span>
            </>
          ) : null
        }
        confirmLabel="Create"
        isLoading={createLoading}
      />
    </div>
  );
};

export default MyProjectQuotesPage;
