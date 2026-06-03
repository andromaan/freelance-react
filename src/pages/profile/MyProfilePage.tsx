import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { selectCurrentUser } from "../../store/userSlice";
import type { BidVM } from "../../types/bid.types";
import type { QuoteVM } from "../../types/quote.types";
import AddQuoteModal from "./components/AddQuoteModal";
import EditBidModal from "./components/EditBidModal";
import EditQuoteModal from "./components/EditQuoteModal";
import { EditProfileTab } from "./EditProfileTab";
import MyQuotesTab from "./MyQuotesTab";
import MyBidsTab from "./MyBidsTab";
import { userImageUrl } from "../../utils";

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
  const [editQuoteTarget, setEditQuoteTarget] = useState<QuoteVM | null>(null);

  const visibleTabs = isFreelancer
    ? TABS
    : TABS.filter((t) => t.key === "edit-profile");

  const avatarLetters = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  const activeTabLabel = TABS.find((t) => t.key === activeTab)?.label ?? "";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main transition-colors flex">
      {/* ── Sidebar — fixed left, full height ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-surface border-r border-border min-h-[calc(100vh-64px)]">
        {/* Avatar card */}
        <div className="p-6 border-b border-border-light flex flex-col items-center gap-3">
          {user?.avatarImg ? (
            <img
              src={userImageUrl(user.avatarImg)}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center select-none">
              {avatarLetters}
            </div>
          )}
          <div className="text-center min-w-0 w-full">
            <p className="font-semibold text-text-main truncate">
              {user?.displayName ?? "—"}
            </p>
            <p className="text-xs text-text-muted truncate mt-0.5">
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
                  : "text-text-muted border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
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
        <div className="lg:hidden bg-surface border-b border-border px-4 flex gap-1 overflow-x-auto">
          {visibleTabs.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigate(`/profile/${key}`)}
              aria-current={activeTab === key ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-gray-700 dark:hover:text-gray-200"
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
          <div className="mb-6 pb-5 border-b border-border">
            <h1 className="text-2xl font-bold text-text-main">
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
          {activeTab === "my-quotes" && (
            <MyQuotesTab onEditQuote={(quote) => setEditQuoteTarget(quote)} />
          )}
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <AddQuoteModal
        isOpen={quoteTarget !== null}
        onClose={() => setQuoteTarget(null)}
        projectId={quoteTarget?.projectId ?? ""}
        projectTitle={undefined}
        quoteAmount={quoteTarget?.amount}
        proposalMessage={quoteTarget?.message}
      />

      {editBidTarget && (
        <EditBidModal
          isOpen={editBidTarget !== null}
          onClose={() => setEditBidTarget(null)}
          bid={editBidTarget}
        />
      )}

      {editQuoteTarget && (
        <EditQuoteModal
          isOpen={editQuoteTarget !== null}
          onClose={() => setEditQuoteTarget(null)}
          quote={editQuoteTarget}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
