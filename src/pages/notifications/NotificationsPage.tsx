import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/userSlice";
import { markAsRead, markAllAsRead } from "../../store/notificationSlice";
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
import Pagination from "../../components/ui/Pagination";
import type { SelectOption } from "../../styles/selectStyles";

const PAGE_SIZE = 10;

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
    try {
      await readAll().unwrap();
      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Failed to read all:", error);
    }
  };

  const handleFilterChange = (
    newIsRead: boolean | null,
    newType: SelectOption<number> | null,
  ) => {
    setPage(1);
    setIsReadFilter(newIsRead);
    setTypeFilter(newType);
  };

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
      />

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

export default Notifications;
