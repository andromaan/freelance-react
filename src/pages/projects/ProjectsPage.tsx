import React, { useEffect, useId, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { useGetAllCategoriesQuery } from "../../services/categories/categoriesApi";
import { useGetProjectsFilteredQuery } from "../../services/projects/projectsApi";
import {
  mergeSelectStyles,
  useSelectStyles,
  type SelectOption,
} from "../../styles/selectStyles";
import { type ProjectFilterVM } from "../../types/project.types";
import ProjectCard from "./components/ProjectCard";
import { useTheme } from "../../context/ThemeContext";
import Pagination from "../../components/ui/Pagination";
import { useTranslation } from "react-i18next";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 9;

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="bg-surface rounded-xl border border-border shadow-sm p-5 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
    <div className="space-y-1.5 mb-4">
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="border-t border-border-light pt-4 flex items-center justify-between">
      <div className="space-y-1">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-8 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const searchId = useId();
  const budgetMinId = useId();
  const budgetMaxId = useId();
  const deadlineMaxId = useId();

  const [searchParams, setSearchParams] = useSearchParams();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [titleInput, setTitleInput] = useState(
    () => searchParams.get("title") || "",
  );
  const [titleSearch, setTitleSearch] = useState(
    () => searchParams.get("title") || "",
  );
  const [budgetMin, setBudgetMin] = useState(
    () => searchParams.get("budgetMin") || "",
  );
  const [budgetMax, setBudgetMax] = useState(
    () => searchParams.get("budgetMax") || "",
  );
  const [deadlineMax, setDeadlineMax] = useState(
    () => searchParams.get("deadlineMax") || "",
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    () =>
      searchParams.get("categories")?.split(",").map(Number).filter(Boolean) ||
      [],
  );

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (titleSearch) params.set("title", titleSearch);
    if (budgetMin) params.set("budgetMin", budgetMin);
    if (budgetMax) params.set("budgetMax", budgetMax);
    if (deadlineMax) params.set("deadlineMax", deadlineMax);
    if (selectedCategoryIds.length > 0)
      params.set("categories", selectedCategoryIds.join(","));

    setSearchParams(params, { replace: true });
  }, [
    page,
    titleSearch,
    budgetMin,
    budgetMax,
    deadlineMax,
    selectedCategoryIds,
    setSearchParams,
  ]);

  // Debounce title search
  useEffect(() => {
    const t = setTimeout(() => {
      setTitleSearch(titleInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [titleInput]);

  const handleCategoryChange = (selected: readonly SelectOption<number>[]) => {
    const ids = selected.map((o) => o.value);
    setSelectedCategoryIds(ids);
  };

  const handleBudgetChange = () => setPage(1);

  const hasFilters =
    titleSearch !== "" ||
    budgetMin !== "" ||
    budgetMax !== "" ||
    deadlineMax !== "" ||
    selectedCategoryIds.length > 0;

  const clearFilters = () => {
    setTitleInput("");
    setTitleSearch("");
    setBudgetMin("");
    setBudgetMax("");
    setDeadlineMax("");
    setSelectedCategoryIds([]);
    setPage(1);
  };

  // __ Style for react-select _____________________
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const styles = mergeSelectStyles(useSelectStyles<number>(), {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? "#111827" : "#f3f4f6",
      borderColor: isDark ? "#4b5563" : "#e5e7eb",
      color: isDark ? "#f9fafb" : "#111827",
    }),
  });

  // ── API ────────────────────────────────────────────────────────────────────
  const filter: ProjectFilterVM = {
    page,
    pageSize: PAGE_SIZE,
    ...(titleSearch && { title: titleSearch }),
    ...(budgetMin !== "" &&
      !isNaN(Number(budgetMin)) && { budgetMin: Number(budgetMin) }),
    ...(budgetMax !== "" &&
      !isNaN(Number(budgetMax)) && { budgetMax: Number(budgetMax) }),
    ...(deadlineMax !== "" && { deadlineMax }),
    ...(status !== null && { projectStatus: status }),
    ...(selectedCategoryIds.length > 0 && { categoryIds: selectedCategoryIds }),
  };

  const { data, isFetching, isLoading } = useGetProjectsFilteredQuery(filter);
  const { data: categories = [] } = useGetAllCategoriesQuery();

  const projects = data?.items ?? [];
  const totalPages = data?.pageCount ?? 1;
  const totalCount = data?.totalCount ?? 0;
  const isLoadingContent = isLoading || isFetching;

  // If current page is empty after filtering, go back one page
  useEffect(() => {
    if (!isFetching && !isLoading && page > 1 && projects.length === 0) {
      setPage((p) => p - 1);
    }
  }, [isFetching, isLoading, projects.length, page]);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-64px)] bg-main transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">
            {t("projects.title")}
          </h1>
          <p className="text-text-muted text-sm leading-relaxed max-w-xl">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <label htmlFor={searchId} className="sr-only">
                {t("projects.searchPlaceholder")}
              </label>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id={searchId}
                type="search"
                placeholder={t("projects.searchPlaceholder")}
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-main text-text-main placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            {/* Budget min */}
            <div>
              <label htmlFor={budgetMinId} className="sr-only">
                {t("projects.budgetMin")}
              </label>
              <input
                id={budgetMinId}
                type="number"
                min="0"
                step="1"
                placeholder={t("projects.budgetMin")}
                value={budgetMin}
                onChange={(e) => {
                  setBudgetMin(e.target.value);
                  handleBudgetChange();
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-main text-text-main placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            {/* Budget max */}
            <div>
              <label htmlFor={budgetMaxId} className="sr-only">
                {t("projects.budgetMax")}
              </label>
              <input
                id={budgetMaxId}
                type="number"
                min="0"
                step="1"
                placeholder={t("projects.budgetMax")}
                value={budgetMax}
                onChange={(e) => {
                  setBudgetMax(e.target.value);
                  handleBudgetChange();
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-main text-text-main placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            {/* Deadline max */}
            <div>
              <label htmlFor={deadlineMaxId} className="sr-only">
                {t("projects.maxDeadline")}
              </label>
              <input
                id={deadlineMaxId}
                type={deadlineMax ? "date" : "text"}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                placeholder={t("projects.maxDeadline")}
                title={t("projects.maxDeadline")}
                value={deadlineMax}
                onChange={(e) => {
                  setDeadlineMax(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-main text-text-main placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            <Select<SelectOption<number>, true>
              inputId="create-project-categories"
              isMulti
              options={categoryOptions}
              onChange={handleCategoryChange}
              styles={styles}
              className="lg:col-span-2"
              placeholder={t("projects.selectCategories")}
              noOptionsMessage={() => t("projects.noCategories")}
              aria-label={t("projects.selectCategories")}
              value={categoryOptions.filter((o) =>
                selectedCategoryIds.includes(o.value),
              )}
            />

            {/* Clear filters */}
            {hasFilters && (
              <div className="col-span-1 flex items-center">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {t("projects.clearFilters")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Result count ── */}
        {!isLoadingContent && (
          <p className="text-sm text-text-muted mb-4">
            {totalCount === 0
              ? t("projects.noProjectsFound")
              : `${totalCount} ${totalCount === 1 ? t("projects.projectFound") : t("projects.projectsFound")}`}
            {hasFilters && ` · ${t("projects.filtered")}`}
          </p>
        )}

        {/* ── Grid ── */}
        {isLoadingContent ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-busy="true"
            aria-label="Loading projects"
          >
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-text-muted font-medium mb-1">
              {t("projects.noProjectsFound")}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {t("projects.tryAdjusting")}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary-hover text-white transition-colors"
              >
                {t("projects.clearFilters")}
              </button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}

        {/* ── Pagination ── */}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
};

export default ProjectsPage;
