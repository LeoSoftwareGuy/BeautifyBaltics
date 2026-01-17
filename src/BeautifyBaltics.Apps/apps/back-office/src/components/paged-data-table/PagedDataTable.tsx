import React from 'react';
import { MantineRadius } from '@mantine/core';
import {
  DataTable,
  DataTablePaginationProps,
  DataTableRowExpansionProps,
  DataTableSortStatus,
  useDataTableColumns,
} from 'mantine-datatable';

import { PagedDataTableColumn, PaginationParams } from './types';

const DEFAULT_PAGE = 1;
const DEFAULT_RECORDS_PER_PAGE = 10;
const RECORDS_PER_PAGE_OPTIONS = [10, 20, 40, 80];

export interface PagedDataTableProps<TParams extends PaginationParams<TData>, TData> {
  idAccessor?: (keyof TData | (string & NonNullable<unknown>)) | ((record: TData) => React.Key);
  data?: TParams | null;
  columns: PagedDataTableColumn<TData>[];
  onPageChange?: (page: number) => void;
  onRecordsPerPageChange?: (recordsPerPage: number) => void;
  fetching?: boolean;
  withTableBorder?: boolean;
  columnsKey?: string | undefined;
  rowExpansion?: DataTableRowExpansionProps<TData>;
  pinFirstColumn?: boolean;
  pinLastColumn?: boolean;
  sortStatus?: DataTableSortStatus<TData>;
  onSortStatusChange?: (status: DataTableSortStatus<TData>) => void;
  borderRadius?: MantineRadius;
  striped?: boolean;
  highlightOnHover?: boolean;
  withRecordsPerPageSelector?: boolean;
  selectedRecords?: TData[];
  onSelectedRecordsChange?: (records: TData[]) => void;
  isRecordSelectable?: (record: TData) => boolean;
  minHeight?: number;
  noRecordsText?: string;
}

export default function PagedDataTable<TParams extends PaginationParams<TData>, TData>({
  idAccessor,
  data,
  columns,
  onPageChange,
  onRecordsPerPageChange,
  fetching = false,
  withTableBorder = true,
  columnsKey = undefined,
  rowExpansion,
  pinFirstColumn,
  pinLastColumn,
  sortStatus,
  onSortStatusChange,
  borderRadius = 'md',
  striped = true,
  highlightOnHover = true,
  withRecordsPerPageSelector = true,
  selectedRecords,
  onSelectedRecordsChange,
  isRecordSelectable,
  minHeight = 200,
  noRecordsText = 'No records found',
}: PagedDataTableProps<TParams, TData>) {
  const { effectiveColumns } = useDataTableColumns({
    key: columnsKey,
    columns: columns.map((column) => ({
      ...column,
      sortable: column.sortable ?? !!column.sortKey,
    })),
  });

  const handleOnPageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
  };

  const handleOnRecordsPerPageChange = (newRecordsPerPage: number) => {
    if (onRecordsPerPageChange) onRecordsPerPageChange(newRecordsPerPage);
  };

  const sortingProps = sortStatus && onSortStatusChange
    ? { sortStatus, onSortStatusChange }
    : {};

  const selectionProps = selectedRecords !== undefined && onSelectedRecordsChange
    ? {
      selectedRecords,
      onSelectedRecordsChange,
      ...(isRecordSelectable && { isRecordSelectable }),
    }
    : {};

  const paginationProps: DataTablePaginationProps = {
    page: data?.page ?? DEFAULT_PAGE,
    recordsPerPage: data?.pageSize ?? DEFAULT_RECORDS_PER_PAGE,
    totalRecords: data?.totalItemCount ?? 0,
    onPageChange: handleOnPageChange,
  };

  if (withRecordsPerPageSelector) {
    (paginationProps as DataTablePaginationProps).recordsPerPageOptions = RECORDS_PER_PAGE_OPTIONS;
    (paginationProps as DataTablePaginationProps).onRecordsPerPageChange = handleOnRecordsPerPageChange;
    (paginationProps as DataTablePaginationProps).recordsPerPageLabel = 'Records per page';
  }

  return (
    <DataTable<TData>
      idAccessor={idAccessor}
      storeColumnsKey={columnsKey}
      striped={striped}
      highlightOnHover={highlightOnHover}
      withTableBorder={withTableBorder}
      minHeight={data?.totalItemCount ? 0 : minHeight}
      fetching={fetching}
      paginationSize="xs"
      borderRadius={borderRadius}
      records={data?.items ?? []}
      columns={effectiveColumns}
      selectionCheckboxProps={{ size: 'xs' }}
      rowExpansion={rowExpansion}
      pinFirstColumn={pinFirstColumn}
      pinLastColumn={pinLastColumn}
      noRecordsText={noRecordsText}
      {...paginationProps}
      {...sortingProps}
      {...selectionProps}
    />
  );
}
