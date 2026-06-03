import React from "react";
import ArrowIcon from "../icons/ArrowIcon";

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

  const handlePageChange = (p: number) => {
    onChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="flex items-center justify-center gap-1 mt-10"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        type="button"
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowIcon direction="left" />
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
            onClick={() => handlePageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
              p === page
                ? "bg-primary text-white border-primary"
                : "border-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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
        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
};

export default Pagination;