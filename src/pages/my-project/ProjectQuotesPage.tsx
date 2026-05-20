import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import { useGetQuotesByProjectQuery } from "../../services/quotes/quotesApi";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import type { QuoteVM } from "../../types/quote.types";

/* ─── SenderInfo ─────────────────────────────────────────────────────────── */
interface SenderInfoProps {
  createdBy: string;
}

const SenderInfo: React.FC<SenderInfoProps> = ({ createdBy }) => {
  const { data: user, isLoading } = useGetUserByIdQuery(createdBy);

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
    <div className="flex items-center gap-3 mt-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
        {initial}
      </div>
      <div className="flex flex-col">
        {user.displayName && (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user.displayName}
          </span>
        )}
        <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
        {user.country?.name && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{user.country.name}</span>
        )}
        {user.role?.name && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{user.role.name}</span>
        )}
      </div>
    </div>
  );
};

/* ─── QuoteCard ──────────────────────────────────────────────────────────── */
interface QuoteCardProps {
  quote: QuoteVM;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="text-2xl font-bold text-green-500">
          ${quote.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap pt-1">
          {new Date(quote.createdAt).toLocaleDateString("uk-UA")}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {quote.message}
      </p>

      <SenderInfo createdBy={quote.createdBy} />
    </div>
  );
};

/* ─── Skeleton card ──────────────────────────────────────────────────────── */
const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
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
const ProjectQuotesPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(projectId!);
  const { data: quotes = [], isLoading: quotesLoading } = useGetQuotesByProjectQuery(projectId!, {
    skip: !projectId,
  });

  const isLoading = quotesLoading;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 pb-12 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(`/my-projects/${projectId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-6"
        >
          ← Back to Project
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
            <p className="text-gray-400 dark:text-gray-500 text-base">No quotes received yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectQuotesPage;
