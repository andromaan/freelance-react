import React from "react";
import CustomSelect from "../../../../components/ui/CustomSelect";
import { NotificationTypeLabels } from "../../../../types/notification.types";
import type { NotificationType } from "../../../../types/notification.types";

type Props = {
  isReadFilter: boolean | null;
  typeFilter: number | null;
  notificationTypes: Array<{ name: string; value: number }>;
  onChange: (newIsRead: boolean | null, newType: number | null) => void;
};

const isReadOptions = [
  { label: "Всі", value: null },
  { label: "Непрочитані", value: false },
  { label: "Прочитані", value: true },
];

const NotificationsFilters: React.FC<Props> = ({
  isReadFilter,
  typeFilter,
  notificationTypes,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isReadOptions.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value, typeFilter)}
            className={`px-4 py-2 text-sm transition-colors ${
              isReadFilter === opt.value
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {notificationTypes.length > 0 && (
        <CustomSelect
          options={notificationTypes.map((t) => ({
            label:
              NotificationTypeLabels[t.value as NotificationType] ?? t.name,
            value: t.value,
          }))}
          value={typeFilter}
          onChange={(v) => onChange(isReadFilter, v)}
          placeholder="Усі типи"
        />
      )}
    </div>
  );
};

export default NotificationsFilters;
