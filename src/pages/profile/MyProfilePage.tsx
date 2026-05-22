import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/userSlice";
import { useGetBidsByFreelancerQuery } from "../../services/bids/bidsApi";
import { ROLES } from "../../constants/roles";
import AddQuoteModal from "./components/AddQuoteModal";
import EditBidModal from "./components/EditBidModal";
import type { BidVM } from "../../types/bid.types";
import APP_ENV from "../../env";

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabKey = "edit-profile" | "my-bids" | "my-quotes";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "edit-profile",
    label: "Edit Profile",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    key: "my-bids",
    label: "My Bids",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
  {
    key: "my-quotes",
    label: "My Quotes",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z"
        />
      </svg>
    ),
  },
];

const VALID_TABS = TABS.map((t) => t.key);

function resolveTab(param: string | undefined, isFreelancer: boolean): TabKey {
  if (param && (VALID_TABS as string[]).includes(param)) return param as TabKey;
  return isFreelancer ? "my-bids" : "edit-profile";
}

// ─── Interest badge ───────────────────────────────────────────────────────────

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
}

const BidCard: React.FC<BidCardProps> = ({ bid, onSubmitQuote, onEditBid }) => (
  <article className="bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3">
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

      {/* Submit Quote CTA — only when employer marked interesting */}
      {bid.isInteresting === true ? (
        <button
          type="button"
          onClick={() => onSubmitQuote(bid)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
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
          onClick={() => onEditBid(bid)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
             bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white
             transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2
             shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit Bid
        </button>
      )}
    </div>
  </article>
);

// ─── Skeleton bid card ────────────────────────────────────────────────────────

const SkeletonBidCard: React.FC = () => (
  <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse flex flex-col gap-3">
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

// ─── Tab panels ───────────────────────────────────────────────────────────────

const EditProfileTab: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
      <svg
        className="w-7 h-7 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </div>
    <p className="text-gray-600 dark:text-gray-300 font-medium">Edit Profile</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Coming soon</p>
  </div>
);

interface MyBidsTabProps {
  onSubmitQuote: (bid: BidVM) => void;
  onEditBid: (bid: BidVM) => void;
}

const MyBidsTab: React.FC<MyBidsTabProps> = ({ onSubmitQuote, onEditBid }) => {
  const { data: bids = [], isLoading } = useGetBidsByFreelancerQuery();
  const [filter, setFilter] = useState<InterestFilter>("all");

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
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MyQuotesTab: React.FC = () => (
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
    <p className="text-gray-600 dark:text-gray-300 font-medium">My Quotes</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Coming soon</p>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const MyProfilePage: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isFreelancer = user?.role?.name === ROLES.FREELANCER;

  const activeTab = resolveTab(tab, isFreelancer);

  // Quote & edit bid modal state
  const [quoteTarget, setQuoteTarget] = useState<BidVM | null>(null);
  const [editBidTarget, setEditBidTarget] = useState<BidVM | null>(null);

  const visibleTabs = isFreelancer
    ? TABS
    : TABS.filter((t) => t.key === "edit-profile");

  const avatarLetters = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  const activeTabLabel = TABS.find((t) => t.key === activeTab)?.label ?? "";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors flex">
      {/* ── Sidebar — fixed left, full height ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-64px)]">
        {/* Avatar card */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3">
          {user?.avatarImg ? (
            <img
              src={`${APP_ENV.API_URL}/${user.avatarImg}`}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center select-none">
              {avatarLetters}
            </div>
          )}
          <div className="text-center min-w-0 w-full">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {user?.displayName ?? "—"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {user?.email}
            </p>
            {user?.role?.name && (
              <span className="mt-2 inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                {user.role.name}
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label="Profile sections" className="flex-1 py-3">
          {visibleTabs.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigate(`/profile/${key}`)}
              aria-current={activeTab === key ? "page" : undefined}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-left transition-colors border-r-2 ${
                activeTab === key
                  ? "bg-primary/5 dark:bg-primary/10 text-primary border-primary"
                  : "text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span
                className={
                  activeTab === key
                    ? "text-primary"
                    : "text-gray-400 dark:text-gray-500"
                }
              >
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile tab bar */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex gap-1 overflow-x-auto">
          {visibleTabs.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigate(`/profile/${key}`)}
              aria-current={activeTab === key ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <main className="flex-1 p-6 lg:p-8 max-w-4xl w-full mx-auto">
          {/* Tab heading */}
          <div className="mb-6 pb-5 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeTabLabel}
            </h1>
          </div>

          {activeTab === "edit-profile" && <EditProfileTab />}
          {activeTab === "my-bids" && (
            <MyBidsTab
              onSubmitQuote={(bid) => setQuoteTarget(bid)}
              onEditBid={(bid) => setEditBidTarget(bid)}
            />
          )}
          {activeTab === "my-quotes" && <MyQuotesTab />}
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <AddQuoteModal
        isOpen={quoteTarget !== null}
        onClose={() => setQuoteTarget(null)}
        projectId={quoteTarget?.projectId ?? ""}
        projectTitle={undefined}
      />

      {editBidTarget && (
        <EditBidModal
          isOpen={editBidTarget !== null}
          onClose={() => setEditBidTarget(null)}
          bid={editBidTarget}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
