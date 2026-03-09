import { useState, useEffect, useRef } from "react";

export interface SelectOption<T extends string | number = string | number> {
  label: string;
  value: T;
}

interface CustomSelectProps<T extends string | number> {
  /** List of selectable options */
  options: SelectOption<T>[];
  /** Currently selected value, or null when the placeholder/"all" option is active */
  value: T | null;
  /** Called with the new value (or null when the placeholder option is chosen) */
  onChange: (value: T | null) => void;
  /** Label shown both as the first "reset" option and when nothing is selected */
  placeholder?: string;
  /** Extra Tailwind classes applied to the trigger button (e.g. custom width) */
  className?: string;
}

/**
 * Reusable Tailwind UI–style custom listbox / select component.
 *
 * Usage:
 * ```tsx
 * <CustomSelect
 *   options={[{ label: "Option A", value: 1 }, { label: "Option B", value: 2 }]}
 *   value={selected}
 *   onChange={setSelected}
 *   placeholder="All options"
 * />
 * ```
 */
function CustomSelect<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "All",
  className = "w-48",
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    value === null
      ? placeholder
      : (options.find((o) => o.value === value)?.label ?? placeholder);

  const handleSelect = (v: T | null) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${className}`}
      >
        <span className="truncate">{selectedLabel}</span>
        {/* Chevron */}
        <svg
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul className="absolute left-0 z-20 mt-1 w-full min-w-max overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
          {/* Placeholder / "all" option */}
          <li>
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`relative flex w-full items-center gap-3 px-4 py-2 transition-colors ${
                value === null
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="flex-1 truncate text-left">{placeholder}</span>
              {value === null && <Checkmark />}
            </button>
          </li>

          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`relative flex w-full items-center gap-3 px-4 py-2 transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="flex-1 truncate text-left">{opt.label}</span>
                  {isSelected && <Checkmark />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Small inline checkmark icon (Heroicons solid check) */
function Checkmark() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0 text-primary"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default CustomSelect;
