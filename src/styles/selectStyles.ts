import { useMemo } from "react";
import type { CSSObjectWithLabel, StylesConfig } from "react-select";
import { useTheme } from "../context/ThemeContext";

// ─── Shared react-select styles matched to the project's design system ────────
//
// Dynamic usage (React component) — реагує на toggleTheme без перезавантаження:
//   import { useSelectStyles } from "../../../styles/selectStyles";
//   <Select styles={useSelectStyles<number>()} ... />
//
// Статичне використання (якщо тема відома заздалегідь):
//   import { buildSelectStyles } from "../../../styles/selectStyles";
//   const styles = buildSelectStyles(isDark);

export interface SelectOption<T = number | string> {
  value: T;
  label: string;
}

/**
 * Hook — повертає стилі, які автоматично оновлюються при toggleTheme.
 * Мемоізується по `theme`, тому об'єкт стилів не перестворюється зайво.
 */
export function useSelectStyles<T = number | string>(): StylesConfig<
  SelectOption<T>
> {
  const { theme } = useTheme();
  // useMemo гарантує, що новий об'єкт стилів створюється лише коли тема змінилась,
  // але ЗАВЖДИ після зміни theme — react-select отримає новий референс і перемалює себе.
  return useMemo(() => buildSelectStyles<T>(theme === "dark"), [theme]);
}

/** Будує StylesConfig для заданого стану теми. */
export function buildSelectStyles<T = number | string>(
  isDark: boolean,
): StylesConfig<SelectOption<T>> {
  // ── Палітра ──────────────────────────────────────────────────────────────────
  const bg = isDark ? "#1f2937" : "#FFFFFF";
  const bgHover = isDark ? "#374151" : "#dddddd";
  const border = isDark ? "#4b5563" : "#d1d5db";
  const text = isDark ? "#f9fafb" : "#111827";
  const placeholder = isDark ? "#6b7280" : "#6a7282";
  const indicator = isDark ? "#6b7280" : "#9ca3af";

  // ── Акцентний колір (indigo-600) ─────────────────────────────────────────────
  const primary = "#1976d2";
  const primaryLight = isDark ? "rgba(37,99,235,0.25)" : "rgba(37,99,235,0.10)";
  const multiValueBg = isDark ? "rgba(37,99,235,0.30)" : "rgba(37,99,235,0.12)";
  const multiValueText = isDark ? "#bfdbfe" : "#1e40af";

  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: bg,
      borderColor: state.isFocused ? primary : border,
      borderRadius: "0.5rem",
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
        backgroundColor: "rgba(37,99,235,0.2)",
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
        ? "0 10px 25px rgba(0,0,0,0.50)"
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
      color: indicator,
      padding: "0 8px",
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      transition: "transform 200ms",
      "&:hover": { color: primary },
    }),

    clearIndicator: (base) => ({
      ...base,
      color: indicator,
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

// ── Функція для злиття базових стилів з кастомними override ────────────────────
export function mergeSelectStyles<T = number | string>(
  base: StylesConfig<SelectOption<T>>,
  overrides: Partial<StylesConfig<SelectOption<T>>>
): StylesConfig<SelectOption<T>> {
  const merged = { ...base };

  (Object.keys(overrides) as Array<keyof typeof overrides>).forEach((key) => {
    const overrideFn = overrides[key];
    const baseFn = merged[key];

    if (overrideFn) {
      merged[key] = ((provided: CSSObjectWithLabel, state: any) => {
        const baseResult = typeof baseFn === "function"
          ? baseFn(provided, state)
          : provided;
        const overrideResult = overrideFn(baseResult, state);
        return { ...baseResult, ...overrideResult };
      }) as any;
    }
  });

  return merged;
}