import { useEffect, useMemo, useRef } from 'react';
import {
  Alert,
  Button,
  Stack,
  Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import {
  PagedDataTable,
  PagedDataTableColumn,
  usePagedTableQuery,
} from '@/components/paged-data-table';
import type {
  FindJobsParams,
  FindJobsResponse,
  FindJobsResponsePagedResponse,
} from '@/state/endpoints/api.schemas';
import { useFindJobs } from '@/state/endpoints/jobs';

import {
  renderActionsCell,
  renderCategoryCell,
  renderDurationCell,
  renderProcedureCell,
} from './treatments-data-table-renderers';

const PAGE_SIZE = 12;

interface TreatmentsDataTableProps {
  search?: string;
  categoryId?: string | null;
}

export default function TreatmentsDataTable({
  search,
  categoryId,
}: TreatmentsDataTableProps) {
  const {
    query,
    onPageChange,
    onRecordsPerPageChange,
    onFilterChange,
  } = usePagedTableQuery<FindJobsParams>({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const previousSearchRef = useRef<string | undefined>(undefined);
  const previousCategoryRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (previousSearchRef.current === search) return;
    previousSearchRef.current = search;
    onFilterChange('text', search?.trim() ? search : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (previousCategoryRef.current === categoryId) return;
    previousCategoryRef.current = categoryId;
    onFilterChange('categoryId', categoryId ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useFindJobs(query, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  });

  const columns = useMemo<PagedDataTableColumn<FindJobsResponse>[]>(() => [
    {
      accessor: 'name',
      title: 'Procedure',
      render: renderProcedureCell,
    },
    {
      accessor: 'categoryName',
      title: 'Category',
      render: renderCategoryCell,
    },
    {
      accessor: 'durationMinutes',
      title: 'Avg. Duration',
      textAlign: 'right',
      render: renderDurationCell,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlign: 'right',
      render: renderActionsCell,
    },
  ], []);

  const tableData: FindJobsResponsePagedResponse = data ?? {
    items: [],
    page: query.page ?? 1,
    pageSize: query.pageSize ?? PAGE_SIZE,
    pageCount: 0,
    totalItemCount: 0,
  };

  return (
    <Stack gap="md">
      {isError ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          title="Unable to load treatments"
        >
          <Stack gap={4}>
            <Text size="sm">Something went wrong while fetching treatments.</Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </Stack>
        </Alert>
      ) : null}

      <PagedDataTable<FindJobsResponsePagedResponse, FindJobsResponse>
        idAccessor="id"
        data={tableData}
        columns={columns}
        fetching={isLoading}
        onPageChange={onPageChange}
        onRecordsPerPageChange={onRecordsPerPageChange}
        noRecordsText="No treatments found."
      />
    </Stack>
  );
}
