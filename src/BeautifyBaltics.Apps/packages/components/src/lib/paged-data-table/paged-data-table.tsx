import React from 'react';
import { MantineRadius, useMantineTheme } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import {
  DataTable,
  DataTablePaginationProps,
  DataTableRowExpansionProps,
  DataTableSortStatus,
  useDataTableColumns,
} from 'mantine-datatable';

import { PagedDataTableColumn } from './types';

import classes from './PagedDataTable.module.css';

const DEFAULT_PAGE = 1;
const DEFAULT_RECORDS_PER_PAGE = 10;
const RECORDS_PER_PAGE_OPTIONS = [10, 20, 40, 80];

interface PaginationParams<TData> {
  items?: TData[] | null;
  page?: number | null;
  pageSize?: number | null;
  totalItemCount?: number | null;
}

export interface PagedDataTableProps<TParams extends PaginationParams<TData>, TData> {
  idAccessor?: (keyof TData | (string & NonNullable<unknown>)) | ((record: TData) => React.Key);
  variant?: 'default' | 'alt';
  data?: TParams | null;
  columns: PagedDataTableColumn<TData>[];
  onPageChange?: (page: number) => void;
  onRecordsPerPageChange?: (recordsPerPage: number) => void;
  fetching?: boolean;
  fullHeight?: boolean;
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
}

export default function PagedDataTable<TParams extends PaginationParams<TData>, TData>({
  idAccessor,
  variant = 'default',
  data,
  columns,
  onPageChange,
  onRecordsPerPageChange,
  fetching = false,
  fullHeight = false,
  withTableBorder = false,
  columnsKey = undefined,
  rowExpansion,
  pinFirstColumn,
  pinLastColumn,
  sortStatus,
  onSortStatusChange,
  borderRadius,
  striped = true,
  highlightOnHover = true,
  withRecordsPerPageSelector = true,
  selectedRecords,
  onSelectedRecordsChange,
  isRecordSelectable,
}: PagedDataTableProps<TParams, TData>) {
  const theme = useMantineTheme();
  const { height: viewportHeight } = useViewportSize();

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
    (paginationProps as any).recordsPerPageOptions = RECORDS_PER_PAGE_OPTIONS;
    (paginationProps as any).onRecordsPerPageChange = handleOnRecordsPerPageChange;
    (paginationProps as any).recordsPerPageLabel = 'Records per page';
  }

  return (
    <DataTable<TData>
      classNames={{
        header: variant === 'alt' ? classes.altHeader : undefined,
      }}
      idAccessor={idAccessor}
      storeColumnsKey={columnsKey}
      striped={striped}
      highlightOnHover={highlightOnHover}
      withTableBorder={withTableBorder}
      minHeight={data?.totalItemCount ? 0 : 320}
      height={fullHeight
        ? viewportHeight - theme.other.header.height - theme.other.pageHeader.height - 1
        : undefined}
      fetching={fetching}
      paginationSize="xs"
      borderRadius={borderRadius}
      records={data?.items ?? []}
      columns={effectiveColumns}
      selectionCheckboxProps={{ size: 'xs' }}
      rowExpansion={rowExpansion}
      pinFirstColumn={pinFirstColumn}
      pinLastColumn={pinLastColumn}
      {...paginationProps}
      {...sortingProps}
      {...selectionProps}
    />
  );
}
