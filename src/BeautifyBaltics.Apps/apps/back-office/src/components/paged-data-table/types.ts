import { DataTableColumn } from 'mantine-datatable';

export type PagedDataTableColumn<T> = DataTableColumn<T> & {
  sortKey?: string;
};

export type PagedDataTableColumnFilter<T> = {
  filterKey: keyof T;
  initialValue?: unknown;
  onChange?: (key: keyof T, value: unknown) => void;
};

export interface PaginationParams<TData> {
  items?: TData[] | null;
  page?: number | null;
  pageSize?: number | null;
  totalItemCount?: number | null;
}
