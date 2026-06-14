import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import { useGetQuotesByProjectQuery } from "../../services/quotes/quotesApi";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import {
  useGetAverageRatingQuery,
  useGetReviewsByEmailQuery,
} from "../../services/reviews/reviewsApi";
import {
  useCreateContractMutation,
  useCanContractBeCreatedQuery,
} from "../../services/contracts/contractsApi";
import type { QuoteVM } from "../../types/quote.types";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { toast } from "react-toastify";
import ArrowIcon from "../../components/icons/ArrowIcon";
import { avatarLetters, userImageUrl } from "../../utils";

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

  const email = user?.email || "";
  const { data: averageRating = 0 } = useGetAverageRatingQuery(email, { skip: !email });
  const { data: reviews = [] } = useGetReviewsByEmailQuery(email, { skip: !email });

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 pt-4 border-t border-border-light animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!user) return null;

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
            {avatarLetters(user)}
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
              {averageRating > 0 ? averageRating.toFixed(1) : "—"}
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

/* ─── QuoteCard ──────────────────────────────────────────────────────────── */
interface QuoteCardProps {
  quote: QuoteVM;
  onCreateContract: (payload: CreateContractPayload) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onCreateContract }) => {
  const dateStr = new Date(quote.createdAt).toLocaleDateString(document.documentElement.lang === "uk" ? "uk-UA" : "en-US");

  const {
    data: canContractBeCreated,
    isLoading: isChecking,
  } = useCanContractBeCreatedQuery(quote.id!, {
    skip: !quote.id,
  });

  return (
    <article className="bg-surface rounded-xl border border-border shadow-sm p-5">
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
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-text-muted">
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

      <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap mb-4">
        {quote.message}
      </p>

      <SenderInfo createdBy={quote.createdBy} />
    </article>
  );
};

/* ─── Skeleton card ──────────────────────────────────────────────────────── */
const SkeletonCard: React.FC = () => (
  <div className="bg-surface rounded-xl border border-border shadow-sm p-5 animate-pulse">
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
    <div className="flex items-center gap-3 pt-4 border-t border-border-light">
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
  const { t } = useTranslation();
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
        const result = await createContract(selectedQuote.quoteId).unwrap();
        setIsConfirmOpen(false);
        setSelectedQuote(null);
        navigate(`/contract/${result.data.id}`)
      } catch (err: any) {
        toast.error(
          "Error creating contract: " + (err?.data?.message || err.message),
        );
      }
    }
  };

  const isLoading = quotesLoading;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main pb-12 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(`/my-projects/${projectId}`)}
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
        title={t("projects.quotes.acceptTitle")}
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
        variant="primary"
      />
    </div>
  );
};

export default MyProjectQuotesPage;
