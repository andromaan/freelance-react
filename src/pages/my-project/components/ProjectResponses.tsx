import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGetBidsByProjectQuery } from "../../../services/bids/bidsApi";
import { useGetQuotesByProjectQuery } from "../../../services/quotes/quotesApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  projectId: string;
}

// ─── Skeleton counter ─────────────────────────────────────────────────────────

const CountSkeleton: React.FC = () => (
  <span
    className="block mx-auto mb-1 h-9 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
    aria-hidden="true"
  />
);

// ─── Single stat cell ─────────────────────────────────────────────────────────

interface StatCellProps {
  to: string;
  count: number;
  isLoading: boolean;
  label: string;
  color: string; // Tailwind text-* class
}

const StatCell: React.FC<StatCellProps> = ({
  to,
  count,
  isLoading,
  label,
  color,
}) => (
  <Link
    to={to}
    aria-label={`${count} ${label}`}
    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group flex flex-col items-center"
  >
    {isLoading ? (
      <CountSkeleton />
    ) : (
      <span
        className={`block text-3xl font-bold ${color} mb-1 group-hover:scale-110 transition-transform tabular-nums`}
      >
        {count}
      </span>
    )}
    <span className="text-xs text-text-muted font-semibold uppercase tracking-widest">
      {label}
    </span>
  </Link>
);

// ─── Main component ────────────────────────────────────────────────────────────

const ProjectResponses: React.FC<Props> = ({ projectId }) => {
  const { t } = useTranslation();

  const { data: bids = [], isLoading: isBidsLoading } =
    useGetBidsByProjectQuery(projectId, { skip: !projectId });

  const { data: quotes = [], isLoading: isQuotesLoading } =
    useGetQuotesByProjectQuery(projectId, { skip: !projectId });

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border-light">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider text-center">
          Responses
        </h3>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700 text-center">
        <StatCell
          to={`/my-projects/${projectId}/bids`}
          count={bids.length}
          isLoading={isBidsLoading}
          label={t("projects.responses.bids")}
          color="text-primary"
        />
        <StatCell
          to={`/my-projects/${projectId}/quotes`}
          count={quotes.length}
          isLoading={isQuotesLoading}
          label={t("projects.responses.quotes")}
          color="text-green-500"
        />
      </div>
    </div>
  );
};

export default ProjectResponses;
