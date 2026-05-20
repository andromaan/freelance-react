import type { StylesConfig } from "react-select";

// ─── Shared react-select styles matched to the project's design system ────────
//
// Colours reference:
//   primary   → CSS var (--color-primary), approximated as #7c3aed (violet-600)
//   gray-*    → Tailwind slate/gray palette
//   dark mode → detected via prefers-color-scheme media query at call-time
//
// Usage:
//   import { buildSelectStyles } from "../../../styles/selectStyles";
//   const styles = buildSelectStyles(isDark);
//
// Or simply pass the result of `buildSelectStyles()` directly:
//   styles={buildSelectStyles()}

export interface SelectOption<T = number | string> {
  value: T;
  label: string;
}

/** Returns a StylesConfig object that matches the project design system. */
export function buildSelectStyles<T>(
  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches,
): StylesConfig<SelectOption<T>, true> {
  const bg = isDark ? "#1f2937" : "#ffffff"; // gray-800 / white
  const bgHover = isDark ? "#374151" : "#f9fafb"; // gray-700 / gray-50
  const border = isDark ? "#4b5563" : "#d1d5db"; // gray-600 / gray-300
  const text = isDark ? "#f9fafb" : "#111827"; // gray-50 / gray-900
  const placeholder = isDark ? "#6b7280" : "#9ca3af"; // gray-500 / gray-400
  const primary = "#7c3aed"; // violet-600  (closest to --color-primary)
  const primaryLight = isDark ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.1)";
  const multiValueBg = isDark ? "rgba(124,58,237,0.3)" : "rgba(124,58,237,0.12)";
  const multiValueText = isDark ? "#ddd6fe" : "#5b21b6"; // violet-200 / violet-800

  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: bg,
      borderColor: state.isFocused ? primary : border,
      borderRadius: "0.5rem", // rounded-lg
      boxShadow: state.isFocused ? `0 0 0 2px ${primaryLight}` : "none",
      minHeight: "2.375rem",
      fontSize: "0.875rem",
      transition: "border-color 150ms, box-shadow 150ms",
      "&:hover": { borderColor: state.isFocused ? primary : border },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "2px 8px",
      gap: "4px",
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: multiValueBg,
      borderRadius: "999px",
      padding: "0 2px",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: multiValueText,
      fontSize: "0.75rem",
      fontWeight: 600,
      paddingLeft: "8px",
      paddingRight: "4px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: multiValueText,
      borderRadius: "999px",
      "&:hover": {
        backgroundColor: "rgba(124,58,237,0.2)",
        color: multiValueText,
      },
    }),

    placeholder: (base) => ({
      ...base,
      color: placeholder,
      fontSize: "0.875rem",
    }),

    singleValue: (base) => ({
      ...base,
      color: text,
    }),

    input: (base) => ({
      ...base,
      color: text,
      fontSize: "0.875rem",
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: "0.5rem",
      boxShadow: isDark
        ? "0 10px 25px rgba(0,0,0,0.5)"
        : "0 10px 25px rgba(0,0,0,0.12)",
      zIndex: 9999,
      overflow: "hidden",
    }),

    menuList: (base) => ({
      ...base,
      padding: "4px",
      maxHeight: "200px",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? primaryLight
        : state.isFocused
          ? bgHover
          : "transparent",
      color: state.isSelected ? primary : text,
      fontWeight: state.isSelected ? 600 : 400,
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      padding: "6px 10px",
      cursor: "pointer",
      transition: "background-color 100ms",
      "&:active": { backgroundColor: primaryLight },
    }),

    indicatorSeparator: () => ({ display: "none" }),

    dropdownIndicator: (base, state) => ({
      ...base,
      color: isDark ? "#6b7280" : "#9ca3af",
      padding: "0 8px",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 200ms",
      "&:hover": { color: primary },
    }),

    clearIndicator: (base) => ({
      ...base,
      color: isDark ? "#6b7280" : "#9ca3af",
      padding: "0 4px",
      "&:hover": { color: "#ef4444" },
    }),

    loadingIndicator: (base) => ({
      ...base,
      color: primary,
    }),

    noOptionsMessage: (base) => ({
      ...base,
      color: placeholder,
      fontSize: "0.875rem",
    }),
  };
}
