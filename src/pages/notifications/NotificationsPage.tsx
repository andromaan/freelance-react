import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/userSlice";
import { markAsRead } from "../../store/notificationSlice";
import type { AppDispatch } from "../../store";
import {
  useGetNotificationsPaginatedFilteredQuery,
  useGetNotificationTypesEmployerQuery,
  useGetNotificationTypesFreelancerQuery,
  useToggleIsReadMutation,
  useReadAllMutation,
} from "../../services/notification/notificationApi";
import { NotificationTypeLabels } from "../../types/notification.types";
import type { NotificationType } from "../../types/notification.types";
import CustomSelect from "../../components/ui/CustomSelect";
import "./Notifications.scss";

const PAGE_SIZE = 10;

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "щойно";
  if (diffMin < 60) return `${diffMin} хв тому`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} год тому`;
  return date.toLocaleDateString("uk-UA");
};

const isReadOptions = [
  { label: "Всі", value: null },
  { label: "Непрочитані", value: false },
  { label: "Прочитані", value: true },
];

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);

  const [page, setPage] = useState(1);
  const [isReadFilter, setIsReadFilter] = useState<boolean | null>(null);
  const [typeFilter, setTypeFilter] = useState<number | null>(null);
  // Track individual item toggling IDs for per-item spinner
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const isFreelancer = currentUser?.role?.name
    ?.toLowerCase()
    .includes("freelancer");
  const isEmployer = currentUser?.role?.name
    ?.toLowerCase()
    .includes("employer");

  const { data: employerTypes = [] } = useGetNotificationTypesEmployerQuery(
    undefined,
    {
      skip: !isEmployer,
    },
  );
  const { data: freelancerTypes = [] } = useGetNotificationTypesFreelancerQuery(
    undefined,
    {
      skip: !isFreelancer,
    },
  );

  const notificationTypes = isFreelancer
    ? freelancerTypes
    : isEmployer
      ? employerTypes
      : [];

  const {
    data,
    isFetching,
    isLoading,
    // refetch: refetchNotifications,
  } = useGetNotificationsPaginatedFilteredQuery({
    page,
    pageSize: PAGE_SIZE,
    isRead: isReadFilter,
    notificationType: typeFilter,
  });

  const [toggleIsRead] = useToggleIsReadMutation();
  const [readAll, { isLoading: readingAll }] = useReadAllMutation();

  const notifications = data?.items ?? [];
  const totalPages = data?.pageCount ?? 1;

  // Якщо після мутації поточна сторінка стала порожньою — повертаємось назад
  useEffect(() => {
    if (!isFetching && !isLoading && page > 1 && notifications.length === 0) {
      setPage((p) => p - 1);
    }
  }, [isFetching, isLoading, notifications.length, page]);

  const handleToggle = async (id: string, currentIsRead: boolean) => {
    if (togglingIds.has(id)) return;
    setTogglingIds((prev) => new Set(prev).add(id));
    try {
      await toggleIsRead(id).unwrap();
      if (!currentIsRead) dispatch(markAsRead(id));
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleReadAll = async () => {
    if (readingAll) return;
    await readAll().unwrap();
  };

  const handleFilterChange = (
    newIsRead: boolean | null,
    newType: number | null,
  ) => {
    setPage(1);
    setIsReadFilter(newIsRead);
    setTypeFilter(newType);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 notification-page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Сповіщення
        </h1>
        <button
          onClick={handleReadAll}
          disabled={readingAll}
          className="relative text-sm text-primary hover:underline disabled:opacity-50 flex items-center gap-2"
        >
          {readingAll && (
            <svg
              className="w-3.5 h-3.5 animate-spin text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          Позначити всі прочитаними
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* isRead filter */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isReadOptions.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => handleFilterChange(opt.value, typeFilter)}
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

        {/* Type filter */}
        {notificationTypes.length > 0 && (
          <CustomSelect
            options={notificationTypes.map((t) => ({
              label:
                NotificationTypeLabels[t.value as NotificationType] ?? t.name,
              value: t.value,
            }))}
            value={typeFilter}
            onChange={(v) => handleFilterChange(isReadFilter, v)}
            placeholder="Усі типи"
          />
        )}
      </div>

      {/* List */}
      <div className="relative space-y-2">
        {/* Refetch overlay — keeps list visible, just dims it */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-6 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm border border-gray-100 dark:border-gray-700">
              <svg
                className="w-3.5 h-3.5 animate-spin text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Оновлення…
              </span>
            </div>
          </div>
        )}

        {/* Initial skeleton (first load only) */}
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 notification-empty-enter">
            <svg
              className="w-14 h-14 mb-3 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-base">Сповіщень не знайдено</p>
          </div>
        ) : (
          <div
            className={`space-y-2 transition-opacity duration-200 ${isFetching ? "opacity-50" : "opacity-100"}`}
          >
            {notifications.map((n, idx) => {
              const isToggling = togglingIds.has(n.id);
              return (
                <div
                  key={n.id}
                  className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 notification-item-enter ${
                    !n.isRead
                      ? "bg-blue-50/60 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"
                      : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                  } ${isToggling ? "opacity-60 scale-[0.99]" : "opacity-100 scale-100"}`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 flex-shrink-0">
                    <span
                      className={`block w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                        !n.isRead
                          ? "bg-primary"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-primary">
                        {NotificationTypeLabels[n.type] ?? "Сповіщення"}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTime(n.sentAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  {/* Toggle read button */}
                  <button
                    onClick={() => handleToggle(n.id, n.isRead)}
                    disabled={isToggling}
                    title={
                      n.isRead
                        ? "Позначити непрочитаним"
                        : "Позначити прочитаним"
                    }
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed ${
                      n.isRead
                        ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        : "text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    }`}
                  >
                    {isToggling ? (
                      <svg
                        className="w-4 h-4 animate-spin text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : n.isRead ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 19V8.5L12 3l9 5.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8.5l9 5.5 9-5.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-8">
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
          {visiblePages.reduce<React.ReactNode[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
              acc.push(
                <span
                  key={`dots-${p}`}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
                >
                  …
                </span>,
              );
            }
            acc.push(
              <button
                key={p}
                onClick={() => setPage(p)}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
      )}
    </div>
  );
};

export default Notifications;
