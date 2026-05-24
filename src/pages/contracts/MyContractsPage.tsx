import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetContractsByUserQuery } from "../../services/contracts/contractsApi";

import ContractCard from "./components/ContractCard";

type TabKey = "active" | "pending" | "completed" | "cancelled";

const TABS: { key: TabKey; label: string; icon: React.ReactNode; statuses: string[] }[] = [
  {
    key: "active",
    label: "Active Contracts",
    statuses: ["Active"],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: "pending",
    label: "Pending",
    statuses: ["Pending"],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "completed",
    label: "Completed",
    statuses: ["Completed"],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    key: "cancelled",
    label: "Cancelled",
    statuses: ["Cancelled"],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
];

const VALID_TABS = TABS.map((t) => t.key);

function resolveTab(param: string | undefined): TabKey {
  if (param && (VALID_TABS as string[]).includes(param)) return param as TabKey;
  return "active";
}

const MyContractsPage: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const activeTab = resolveTab(tab);
  const activeTabConfig = TABS.find((t) => t.key === activeTab);

  const { data: contracts, isLoading, error } = useGetContractsByUserQuery();

  const filteredContracts = useMemo(() => {
    if (!contracts || !activeTabConfig) return [];
    return contracts.filter((c) => activeTabConfig.statuses.includes(c.status));
  }, [contracts, activeTabConfig]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors flex">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-64px)]">
        <div className="text-2xl font-bold text-center text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700">
          Contracts Page
        </div>

        <nav aria-label="Contracts sections" className="flex-1 py-3">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigate(`/contracts/${key}`)}
              aria-current={activeTab === key ? "page" : undefined}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-left transition-colors border-r-2 ${
                activeTab === key
                  ? "bg-primary/5 dark:bg-primary/10 text-primary border-primary"
                  : "text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className={activeTab === key ? "text-primary" : "text-gray-400 dark:text-gray-500"}>
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
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigate(`/contracts/${key}`)}
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
          <div className="mb-6 pb-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeTabConfig?.label}
            </h1>
          </div>

          <div className="space-y-6">
            {isLoading && (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                Failed to load contracts.
              </div>
            )}
            {!isLoading && !error && filteredContracts.length === 0 && (
              <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No contracts found in this category.</p>
              </div>
            )}
            {filteredContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyContractsPage;
