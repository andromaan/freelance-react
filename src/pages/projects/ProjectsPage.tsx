import React, { useEffect, useId, useState } from "react";
import Select from "react-select";
import { useGetAllCategoriesQuery } from "../../services/categories/categoriesApi";
import { useGetProjectsFilteredQuery } from "../../services/projects/projectsApi";
import { useSelectStyles, type SelectOption } from "../../styles/selectStyles";
import {
  type ProjectFilterVM
} from "../../types/project.types";
import ProjectCard from "./components/ProjectCard";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 9;

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 animate-pulse">
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
    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex items-center justify-between">
      <div className="space-y-1">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-8 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
  );

  return (
    <div
      className="flex items-center justify-center gap-1 mt-10"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page numbers */}
      {visible.reduce<React.ReactNode[]>((acc, p, idx, arr) => {
        if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
          acc.push(
            <span
              key={`dots-${p}`}
              className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm select-none"
            >
              …
            </span>,
          );
        }
        acc.push(
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
              p === page
                ? "bg-primary text-white border-primary"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {p}
          </button>,
        );
        return acc;
      }, [])}

      {/* Next */}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const ProjectsPage: React.FC = () => {
  const searchId = useId();
  const budgetMinId = useId();
  const budgetMaxId = useId();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [titleInput, setTitleInput] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const styles = useSelectStyles<number>();

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
    selectedCategoryIds.length > 0;

  const clearFilters = () => {
    setTitleInput("");
    setTitleSearch("");
    setBudgetMin("");
    setBudgetMax("");
    setSelectedCategoryIds([]);
    setPage(1);
  };

  // ── API ────────────────────────────────────────────────────────────────────
  const filter: ProjectFilterVM = {
    page,
    pageSize: PAGE_SIZE,
    ...(titleSearch && { title: titleSearch }),
    ...(budgetMin !== "" &&
      !isNaN(Number(budgetMin)) && { budgetMin: Number(budgetMin) }),
    ...(budgetMax !== "" &&
      !isNaN(Number(budgetMax)) && { budgetMax: Number(budgetMax) }),
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Browse Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
            Discover open projects and find work that matches your skills.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <label htmlFor={searchId} className="sr-only">
                Search by title
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
                placeholder="Search by title…"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            {/* Budget min */}
            <div>
              <label htmlFor={budgetMinId} className="sr-only">
                Budget min
              </label>
              <input
                id={budgetMinId}
                type="number"
                min="0"
                step="1"
                placeholder="Budget min ($)"
                value={budgetMin}
                onChange={(e) => {
                  setBudgetMin(e.target.value);
                  handleBudgetChange();
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            {/* Budget max */}
            <div>
              <label htmlFor={budgetMaxId} className="sr-only">
                Budget max
              </label>
              <input
                id={budgetMaxId}
                type="number"
                min="0"
                step="1"
                placeholder="Budget max ($)"
                value={budgetMax}
                onChange={(e) => {
                  setBudgetMax(e.target.value);
                  handleBudgetChange();
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            <Select<SelectOption<number>, true>
              inputId="create-project-categories"
              isMulti
              options={categoryOptions}
              onChange={handleCategoryChange}
              // isLoading={isCategoriesLoading}
              styles={styles}
              placeholder="Select categories…"
              noOptionsMessage={() => "No categories available"}
              aria-label="Select project categories"
              value={categoryOptions.filter((o) =>
                selectedCategoryIds.includes(o.value),
              )}
            />

            {/* Clear filters */}
            {hasFilters && (
              <div className="sm:col-span-2 flex items-center">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
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
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Result count ── */}
        {!isLoadingContent && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {totalCount === 0
              ? "No projects found"
              : `${totalCount} project${totalCount === 1 ? "" : "s"} found`}
            {hasFilters && " · filtered"}
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
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
              No projects found
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Try adjusting your filters or search terms.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary-hover text-white transition-colors"
              >
                Clear filters
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
