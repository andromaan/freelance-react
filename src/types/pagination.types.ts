export interface PagedVM {
  page: number;
  pageSize: number;
}

export interface PaginatedItemsVM<T> {
  page: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}
