import React, { useEffect, useId, useState, useMemo } from "react";
import Select from "react-select";
import { useSearchFreelancersQuery } from "../../services/freelancer/freelancerApi";
import { useGetCountriesQuery } from "../../services/countries/countriesApi";
import { useGetSkillsQuery } from "../../services/skills/skillsApi";
import { useGetLanguagesQuery } from "../../services/languages/languagesApi";
import {
  mergeSelectStyles,
  useSelectStyles,
  type SelectOption,
} from "../../styles/selectStyles";
import { type FreelancerFilterVM } from "../../types/freelancer.types";
import FreelancerCard from "./components/FreelancerCard";
import { useTheme } from "../../context/ThemeContext";
import Pagination from "../../components/ui/Pagination";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 9;

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 animate-pulse flex flex-col h-[280px]">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
    <div className="space-y-1.5 mb-4 flex-1">
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
      <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const FreelancersPage: React.FC = () => {
  const searchId = useId();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [nameInput, setNameInput] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [selectedCountryIds, setSelectedCountryIds] = useState<number[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);

  // Debounce name search
  useEffect(() => {
    const t = setTimeout(() => {
      setNameSearch(nameInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [nameInput]);

  const handleSkillsChange = (selected: readonly SelectOption<number>[]) => {
    setSelectedSkillIds(selected.map((o) => o.value));
    setPage(1);
  };

  const handleCountriesChange = (selected: readonly SelectOption<number>[]) => {
    setSelectedCountryIds(selected.map((o) => o.value));
    setPage(1);
  };

  const handleLanguagesChange = (selected: readonly SelectOption<number>[]) => {
    setSelectedLanguageIds(selected.map((o) => o.value));
    setPage(1);
  };

  const handleRatingChange = () => setPage(1);

  const hasFilters =
    nameSearch !== "" ||
    minRating !== "" ||
    selectedSkillIds.length > 0 ||
    selectedCountryIds.length > 0 ||
    selectedLanguageIds.length > 0;

  const clearFilters = () => {
    setNameInput("");
    setNameSearch("");
    setMinRating("");
    setSelectedSkillIds([]);
    setSelectedCountryIds([]);
    setSelectedLanguageIds([]);
    setPage(1);
  };

  // __ Style for react-select _____________________
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const styles = mergeSelectStyles(useSelectStyles<number>(), {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
      borderColor: isDark ? "#4b5563" : "#e5e7eb",
      color: isDark ? "#f9fafb" : "#111827",
    }),
  });

  // ── API ────────────────────────────────────────────────────────────────────
  const filter: FreelancerFilterVM = {
    page,
    pageSize: PAGE_SIZE,
    ...(nameSearch && { name: nameSearch }),
    ...(minRating !== "" && !isNaN(Number(minRating)) && { minRating: Number(minRating) }),
    ...(selectedSkillIds.length > 0 && { skillIds: selectedSkillIds }),
    ...(selectedCountryIds.length > 0 && { countryIds: selectedCountryIds }),
    ...(selectedLanguageIds.length > 0 && { languageIds: selectedLanguageIds }),
  };

  const { data, isFetching, isLoading } = useSearchFreelancersQuery(filter);
  const { data: skills = [] } = useGetSkillsQuery();
  const { data: countries = [] } = useGetCountriesQuery();
  const { data: languages = [] } = useGetLanguagesQuery();

  const freelancers = data?.items ?? [];
  const totalPages = data?.pageCount ?? 1;
  const totalCount = data?.totalCount ?? 0;
  const isLoadingContent = isLoading || isFetching;

  // If current page is empty after filtering, go back one page
  useEffect(() => {
    if (!isFetching && !isLoading && page > 1 && freelancers.length === 0) {
      setPage((p) => p - 1);
    }
  }, [isFetching, isLoading, freelancers.length, page]);

  const skillOptions = useMemo(() => skills.map((s) => ({ label: s.name, value: s.id })), [skills]);
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.name, value: c.id })), [countries]);
  const languageOptions = useMemo(() => languages.map((l) => ({ label: l.name, value: l.id })), [languages]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Freelancers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
            Discover talented professionals ready to help bring your ideas to life.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative relative">
              <label htmlFor={searchId} className="sr-only">
                Search by name
              </label>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id={searchId}
                type="search"
                placeholder="Search by name…"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            {/* Min Rating */}
            <div>
              <input
                type="number"
                min="0"
                max="5"
                step="0.5"
                placeholder="Min Rating (0-5)"
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  handleRatingChange();
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary transition-colors"
              />
            </div>

            {/* Skills */}
            <Select<SelectOption<number>, true>
              isMulti
              options={skillOptions}
              onChange={handleSkillsChange}
              styles={styles}
              placeholder="Select skills…"
              className="lg:col-span-2"
              noOptionsMessage={() => "No skills available"}
              value={skillOptions.filter((o) => selectedSkillIds.includes(o.value))}
            />

            {/* Countries */}
            <Select<SelectOption<number>, true>
              isMulti
              options={countryOptions}
              onChange={handleCountriesChange}
              styles={styles}
              className="lg:col-span-2"
              placeholder="Select countries…"
              noOptionsMessage={() => "No countries available"}
              value={countryOptions.filter((o) => selectedCountryIds.includes(o.value))}
            />

            {/* Languages */}
            <Select<SelectOption<number>, true>
              isMulti
              options={languageOptions}
              onChange={handleLanguagesChange}
              styles={styles}
              placeholder="Select languages…"
              className="lg:col-span-2"
              noOptionsMessage={() => "No languages available"}
              value={languageOptions.filter((o) => selectedLanguageIds.includes(o.value))}
            />

            {/* Clear filters */}
            {hasFilters && (
              <div className="flex items-center">
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
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              ? "No freelancers found"
              : `${totalCount} freelancer${totalCount === 1 ? "" : "s"} found`}
            {hasFilters && " · filtered"}
          </p>
        )}

        {/* ── Grid ── */}
        {isLoadingContent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : freelancers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
              No freelancers found
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
            {freelancers.map((freelancer) => (
              <li key={freelancer.id}>
                <FreelancerCard freelancer={freelancer} />
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

export default FreelancersPage;
