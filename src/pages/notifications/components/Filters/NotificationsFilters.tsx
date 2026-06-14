import React from "react";
import Select from "react-select";
import { useTheme } from "../../../../context/ThemeContext";
import {
  mergeSelectStyles,
  useSelectStyles,
  type SelectOption,
} from "../../../../styles/selectStyles";
import { getStatusText } from "../../../../utils";
import { useTranslation } from "react-i18next";

type Props = {
  isReadFilter: boolean | null;
  typeFilter: SelectOption<number> | null;
  notificationTypes: Array<{ name: string; value: number }>;
  onChange: (newIsRead: boolean | null, newType: SelectOption<number> | null) => void;
};

const NotificationsFilters: React.FC<Props> = ({
  isReadFilter,
  typeFilter,
  notificationTypes,
  onChange,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isReadOptions = [
    { label: t("notifications.filterAll"), value: null },
    { label: t("notifications.filterUnread"), value: false },
    { label: t("notifications.filterRead"), value: true },
  ];

  const styles = mergeSelectStyles(useSelectStyles<number>(), {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderColor: isDark ? "#374151" : "#e5e7eb",
      color: isDark ? "#f9fafb" : "#111827",
    }),
    input: (base) => ({ ...base, color: isDark ? "#d1d5db" : "#4b5563" }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "#d1d5db" : "#4b5563",
    }),
  });

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex rounded-lg border border-border overflow-hidden">
        {isReadOptions.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value, typeFilter)}
            className={`px-4 py-2 text-sm transition-colors ${
              isReadFilter === opt.value
                ? "bg-primary text-white"
                : "bg-surface text-text-muted hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <Select<SelectOption<number>>
        inputId="notification-type-select"
        options={notificationTypes.map((t) => ({
          label: getStatusText(t.name),
          value: t.value,
        }))}
        value={typeFilter}
        isClearable
        onChange={(v) => onChange(isReadFilter, v)}
        placeholder={t("notifications.filterByType")}
        styles={styles}
        className="w-60"
      />
    </div>
  );
};

export default NotificationsFilters;
