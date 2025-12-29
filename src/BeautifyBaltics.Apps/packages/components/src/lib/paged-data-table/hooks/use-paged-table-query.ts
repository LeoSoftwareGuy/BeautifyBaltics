import { useEffect, useRef, useState } from 'react';
import { useSetState } from '@mantine/hooks';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { isEqual } from 'es-toolkit';
import { DataTableSortStatus } from 'mantine-datatable';

export default function usePagedTableQuery<T extends Record<string, any>, TSort = T>(
  initialState: T = {} as T,
  useURLParams = true,
) {
  const location = useLocation();
  const navigate = useNavigate();

  const initialStateRef = useRef(initialState);
  const [query, setQuery] = useState<Record<string, any>>(initialState);
  const [sortStatus, setSortStatus] = useSetState<DataTableSortStatus<TSort>>({
    columnAccessor: '',
    direction: 'asc',
  });

  useEffect(() => {
    if (!isEqual(initialState, initialStateRef.current)) {
      initialStateRef.current = initialState;
      setQuery(initialState);
    }
  }, [initialState, setQuery]);

  useEffect(() => {
    if (!useURLParams) return;
    const props = { hash: location.hash, search: query as never, replace: true };
    navigate(props).then();
  }, [query, navigate, useURLParams, location.hash]);

  const onPageChange = (page: number) => setQuery({ ...query, page });
  const onRecordsPerPageChange = (pageSize: number) => setQuery({ ...query, pageSize, page: 1 });

  const onFilterChange = (key: keyof T, value: any) => {
    if (!value || value.length === 0) {
      setQuery({ ...query, [key]: undefined, page: 1 });
    } else setQuery({ ...query, [key]: value, page: 1 });
  };

  const onSortStatusChange = (sortKey: string, ascending: boolean) => {
    setQuery({ ...query, sortBy: sortKey, ascending });
  };

  const handleSortStatusChange = (
    newSortStatus: DataTableSortStatus<TSort>,
    columns: { accessor: string; sortKey?: string; sortable?: boolean }[],
  ) => {
    const column = columns.find((col) => col.accessor === newSortStatus.columnAccessor);
    if (column) {
      const key = column.sortKey || (column.sortable ? column.accessor : undefined);
      if (key) {
        setSortStatus(newSortStatus);
        onSortStatusChange(key, newSortStatus.direction === 'asc');
      }
    }
  };

  return {
    query: query as T,
    sortStatus,
    onPageChange,
    onRecordsPerPageChange,
    onFilterChange,
    handleSortStatusChange,
  };
}
