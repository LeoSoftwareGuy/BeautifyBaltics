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
import datetime from '@/utils/datetime';

import { ClientBookingsDataTableFilters } from '../client-bookings-data-table/client-bookings-data-table-filters';
import {
  renderDuration,
  renderPrice,
  renderScheduledAt,
  renderStatus,
} from '../client-bookings-data-table/client-bookings-data-table-renderers';

const DEFAULT_PAGE_SIZE = 5;

type BookingsQuery = FindBookingsParams;

export function ClientDashboardRecentBookings() {
  const { data: user } = useGetUser();
  const clientId = user?.id ?? '';

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
      clientId,
      page: query.page,
      pageSize: query.pageSize,
      sortBy: query.sortBy,
      ascending: query.ascending,
      status: status ? (status as BookingStatus) : undefined,
      from: datetime.toDate(dateRange[0]),
      to: datetime.toDate(dateRange[1]),
    },
    {
      query: {
        enabled: !!clientId,
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
      accessor: 'masterJobTitle',
      title: 'Service & Master',
      render: (booking) => (
        <Stack gap={2}>
          <Text size="sm" fw={500}>{booking.masterJobTitle}</Text>
          <Text size="xs" c="dimmed">{booking.masterName}</Text>
        </Stack>
      ),
    },
    {
      accessor: 'scheduledAt',
      title: 'Date',
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
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        <div>
          <Title order={4}>Recent Bookings</Title>
          <Text c="dimmed" size="sm">Your booking history</Text>
        </div>

        <ClientBookingsDataTableFilters
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
