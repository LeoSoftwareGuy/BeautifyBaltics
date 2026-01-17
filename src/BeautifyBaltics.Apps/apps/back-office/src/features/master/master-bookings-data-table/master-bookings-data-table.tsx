import { useState } from 'react';
import {
  Card, Stack, Text, Title,
} from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';

import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@/components/paged-data-table';
import {
  BookingStatus,
  FindBookingsParams,
  FindBookingsResponse,
  FindBookingsResponsePagedResponse,
} from '@/state/endpoints/api.schemas';
import { useFindBookings } from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';

import { BookingsFilters } from './master-bookings-data-table-filters';
import {
  renderDuration, renderPrice, renderScheduledAt, renderStatus,
} from './master-bookings-data-table-renderers';

const DEFAULT_PAGE_SIZE = 10;

type BookingsQuery = FindBookingsParams;

function toDate(value: Date | string | null | undefined): Date | undefined {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
}

export function MasterBookingsDataTable() {
  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';

  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);
  const [status, setStatus] = useState<string>('');

  const {
    query,
    sortStatus,
    onPageChange,
    onRecordsPerPageChange,
    handleSortStatusChange,
  } = usePagedTableQuery<BookingsQuery, FindBookingsResponse>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'scheduledAt',
    ascending: false,
  });

  const {
    data: bookingsData,
    isLoading,
  } = useFindBookings(
    {
      masterId,
      page: query.page,
      pageSize: query.pageSize,
      sortBy: query.sortBy,
      ascending: query.ascending,
      status: status ? (status as BookingStatus) : undefined,
      from: toDate(dateRange[0]),
      to: toDate(dateRange[1]),
    },
    {
      query: {
        enabled: !!masterId,
      },
    },
  );

  const handleDateRangeChange = (value: DatesRangeValue) => {
    setDateRange(value);
    onPageChange(1);
  };

  const handleStatusChange = (value: string | null) => {
    setStatus(value ?? '');
    onPageChange(1);
  };

  const columns: PagedDataTableColumn<FindBookingsResponse>[] = [
    {
      accessor: 'clientName',
      title: 'Client',
      sortKey: 'clientName',
    },
    {
      accessor: 'masterJobTitle',
      title: 'Service',
      sortKey: 'masterJobTitle',
    },
    {
      accessor: 'scheduledAt',
      title: 'Date & Time',
      sortKey: 'scheduledAt',
      render: renderScheduledAt,
    },
    {
      accessor: 'duration',
      title: 'Duration',
      render: renderDuration,
    },
    {
      accessor: 'price',
      title: 'Price',
      sortKey: 'price',
      render: renderPrice,
    },
    {
      accessor: 'status',
      title: 'Status',
      sortKey: 'status',
      render: renderStatus,
    },
  ];

  return (
    <Card withBorder>
      <Stack gap="md">
        <div>
          <Title order={3}>My Bookings</Title>
          <Text c="dimmed" fz="sm">Manage your appointments and client bookings</Text>
        </div>

        <BookingsFilters
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          status={status}
          onStatusChange={handleStatusChange}
        />

        <PagedDataTable<FindBookingsResponsePagedResponse, FindBookingsResponse>
          idAccessor="id"
          data={bookingsData}
          columns={columns}
          fetching={isLoading}
          onPageChange={onPageChange}
          onRecordsPerPageChange={onRecordsPerPageChange}
          sortStatus={sortStatus}
          onSortStatusChange={(newStatus) => handleSortStatusChange(newStatus, columns)}
          noRecordsText="No bookings found"
        />
      </Stack>
    </Card>
  );
}
