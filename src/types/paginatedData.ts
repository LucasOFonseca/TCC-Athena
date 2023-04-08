import { GenericStatus } from '.';

export interface PaginatedRequestParams {
  query?: string;
  page?: number;
  pageSize?: number;
  filterByStatus?: GenericStatus;
}

export interface PaginatedDataResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  query?: string;
  filterByStatus?: GenericStatus;
}
