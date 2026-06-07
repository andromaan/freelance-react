import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetDisputesByUserQuery } from "../../services/disputes/disputesApi";
import type { DisputeVM } from "../../types/dispute.types";
import DisputeCard from "./components/DisputeCard";
import DisputeTable from "./components/DisputeTable";
import PageLoading from "../../components/ui/PageLoading";
import PageError from "../../components/ui/PageError";

const MyDisputesPage: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { data: disputes = [], isLoading, error } = useGetDisputesByUserQuery(undefined);

  if (isLoading) {
    return <PageLoading message={t("disputes.loading", "Loading disputes...")} />;
  }

  if (error) {
    return <PageError message={t("disputes.error", "Failed to load disputes.")} />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main font-sans pb-12 pt-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-main">
              {t("disputes.myDisputesTitle", "My Disputes")}
            </h1>
            <span className="text-sm font-medium px-3 py-1 bg-surface border border-border rounded-full text-text-muted shadow-sm">
              {t("disputes.totalCount", { count: disputes.length, defaultValue: "Total: {{count}}" })}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {disputes.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {disputes.map((dispute: DisputeVM) => (
                <DisputeCard key={dispute.id} dispute={dispute} />
              ))}
            </div>
          ) : (
            <DisputeTable disputes={disputes} />
          )
        ) : (
          <div className="bg-surface rounded-2xl p-12 text-center border border-border shadow-sm">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
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
            <h3 className="text-lg font-bold text-text-main mb-2">
              {t("disputes.noDisputes", "No disputes found")}
            </h3>
            <p className="text-text-muted">
              {t("disputes.noDisputesDesc", "You don't have any disputes at the moment.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDisputesPage;
