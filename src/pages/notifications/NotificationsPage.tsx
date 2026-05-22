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

import "./Notifications.scss";
import NotificationsHeader from "./components/Header/NotificationsHeader";
import NotificationsFilters from "./components/Filters/NotificationsFilters";
import NotificationsList from "./components/List/NotificationsList";
import type { SelectOption } from "../../styles/selectStyles";

const PAGE_SIZE = 10;

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hours ago`;
  return date.toLocaleDateString("uk-UA");
};

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);

  const [page, setPage] = useState(1);
  const [isReadFilter, setIsReadFilter] = useState<boolean | null>(null);
  const [typeFilter, setTypeFilter] = useState<SelectOption<number> | null>(null);
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
    notificationType: typeFilter?.value,
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
    newType: SelectOption<number> | null,
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
      <NotificationsHeader readingAll={readingAll} onReadAll={handleReadAll} />

      <NotificationsFilters
        isReadFilter={isReadFilter}
        typeFilter={typeFilter}
        notificationTypes={notificationTypes}
        onChange={handleFilterChange}
      />

      <NotificationsList
        notifications={notifications}
        isFetching={isFetching}
        isLoading={isLoading}
        togglingIds={togglingIds}
        onToggle={handleToggle}
        formatTime={formatTime}
      />

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
