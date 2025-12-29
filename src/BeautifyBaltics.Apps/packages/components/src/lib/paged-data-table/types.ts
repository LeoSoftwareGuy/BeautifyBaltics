import { DataTableColumn } from 'mantine-datatable';

export type PagedDataTableColumn<T> = DataTableColumn<T> & {
  sortKey?: string;
};

export type PagedDataTableColumnFilter<T> = {
  filterKey: keyof T;
  initialValue?: any;
  onChange?: (key: keyof T, value: any) => void;
};
