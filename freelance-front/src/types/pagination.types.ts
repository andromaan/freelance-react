export interface PagedVM {
  page: number;
  pageSize: number;
}

export interface NotificationPagedVM extends PagedVM {
  isRead?: boolean | null;
  notificationType?: number | null;
}

export interface PaginatedItemsVM<T> {
  page: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}
